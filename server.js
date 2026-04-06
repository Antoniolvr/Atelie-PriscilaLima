import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: process.env.FRONTEND_URL?.split(",").map(v => v.trim()) || "*"
}));
app.use(express.json());

const CATALOG = {
  1: { id: 1, sku: "SOUSPLAT-001", name: "Sousplat de Crochê", unitPrice: 25.00 },
  2: { id: 2, sku: "TAPETE-OVAL-002", name: "Tapete Oval Verde e Off White", unitPrice: 25.00 },
  3: { id: 3, sku: "CENTRO-MESA-003", name: "Centro de Mesa Redondo Verde com Dourado", unitPrice: 25.00 },
  4: { id: 4, sku: "SOUSPLAT-COLOR-004", name: "Sousplat Redondo Candy Colors", unitPrice: 25.00 },
  5: { id: 5, sku: "CAMINHO-MESA-005", name: "Caminho de Mesa Corações Off White com Dourado", unitPrice: 25.00 }
};

// Em produção, troque isso por banco de dados.
const orders = new Map();

function getPayPalBaseUrl() {
  return process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Erro ao obter access token PayPal:", data);
    throw new Error("Não foi possível autenticar no PayPal.");
  }

  return data.access_token;
}

function normalizeCartItems(rawCart) {
  if (!Array.isArray(rawCart) || rawCart.length === 0) {
    throw new Error("Carrinho vazio.");
  }

  return rawCart.map(item => {
    const catalogItem = CATALOG[item.productId];
    if (!catalogItem) {
      throw new Error(`Produto inválido: ${item.productId}`);
    }

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(`Quantidade inválida para ${catalogItem.name}.`);
    }

    return {
      productId: catalogItem.id,
      sku: catalogItem.sku,
      name: catalogItem.name,
      quantity,
      unitPrice: Number(catalogItem.unitPrice)
    };
  });
}

function calcTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  return {
    subtotal: subtotal.toFixed(2)
  };
}

function validateCustomer(customer = {}) {
  const required = ["name", "phone", "email", "address"];

  for (const field of required) {
    if (!String(customer[field] || "").trim()) {
      throw new Error(`Campo obrigatório ausente: ${field}`);
    }
  }

  return {
    name: String(customer.name).trim(),
    phone: String(customer.phone).trim(),
    email: String(customer.email).trim(),
    address: String(customer.address).trim(),
    note: String(customer.note || "").trim()
  };
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, environment: process.env.PAYPAL_ENV || "sandbox" });
});

app.post("/api/paypal/create-order", async (req, res) => {
  try {
    const customer = validateCustomer(req.body.customer);
    const items = normalizeCartItems(req.body.cart);
    const totals = calcTotals(items);

    const accessToken = await getPayPalAccessToken();

    const paypalBody = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: `atelie-${Date.now()}`,
          description: "Ateliê Priscila Lima",
          amount: {
            currency_code: "BRL",
            value: totals.subtotal,
            breakdown: {
              item_total: {
                currency_code: "BRL",
                value: totals.subtotal
              }
            }
          },
          items: items.map(item => ({
            name: item.name,
            sku: item.sku,
            quantity: String(item.quantity),
            unit_amount: {
              currency_code: "BRL",
              value: item.unitPrice.toFixed(2)
            }
          })),
          custom_id: JSON.stringify({
            customerEmail: customer.email,
            ts: Date.now()
          }).slice(0, 127)
        }
      ],
      application_context: {
        brand_name: "Ateliê Priscila Lima",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
        return_url: `${process.env.FRONTEND_URL}/paypal-return`,
        cancel_url: `${process.env.FRONTEND_URL}/paypal-cancel`
      }
    };

    const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(paypalBody)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro create-order PayPal:", data);
      return res.status(400).json({
        error: "Falha ao criar pedido no PayPal.",
        details: data
      });
    }

    const approvalLink = data.links?.find(link => link.rel === "approve");

    orders.set(data.id, {
      paypalOrderId: data.id,
      status: "CREATED",
      createdAt: new Date().toISOString(),
      customer,
      items,
      totals
    });

    return res.json({
      orderId: data.id,
      approvalUrl: approvalLink?.href || null
    });
  } catch (error) {
    console.error("Erro create-order local:", error);
    return res.status(400).json({
      error: error.message || "Erro ao criar pedido."
    });
  }
});

app.post("/api/paypal/capture-order", async (req, res) => {
  try {
    const { orderId, customer } = req.body;

    if (!orderId) {
      throw new Error("orderId é obrigatório.");
    }

    const existingOrder = orders.get(orderId);
    if (!existingOrder) {
      throw new Error("Pedido não encontrado no servidor.");
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro capture-order PayPal:", data);
      return res.status(400).json({
        error: "Falha ao capturar pagamento.",
        details: data
      });
    }

    const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
    const paidValue = capture?.amount?.value;
    const expectedValue = existingOrder.totals.subtotal;

    if (!capture || capture.status !== "COMPLETED") {
      throw new Error("Pagamento não concluído.");
    }

    if (paidValue !== expectedValue) {
      throw new Error(`Valor pago divergente. Esperado ${expectedValue}, recebido ${paidValue}.`);
    }

    const localOrderId = `ATL-${Date.now()}`;

    orders.set(orderId, {
      ...existingOrder,
      status: "PAID",
      paidAt: new Date().toISOString(),
      localOrderId,
      paypalCaptureId: capture.id,
      paypalStatus: capture.status,
      captureResponse: data,
      customer: customer ? validateCustomer(customer) : existingOrder.customer
    });

    return res.json({
      success: true,
      localOrderId,
      paypalOrderId: orderId,
      paypalCaptureId: capture.id
    });
  } catch (error) {
    console.error("Erro capture-order local:", error);
    return res.status(400).json({
      error: error.message || "Erro ao capturar pedido."
    });
  }
});

// Webhook básico para expansão futura.
app.post("/api/paypal/webhook", (req, res) => {
  console.log("Webhook PayPal recebido:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.get("/paypal-return", async (req, res) => {
  try {
    const orderId = req.query.token;

    if (!orderId) {
      return res.status(400).send("Token do pedido não informado.");
    }

    const existingOrder = orders.get(orderId);
    if (!existingOrder) {
      return res.status(404).send("Pedido não encontrado no servidor.");
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro ao capturar no retorno PayPal:", data);
      return res.status(400).send("Falha ao capturar pagamento.");
    }

    const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
    const paidValue = capture?.amount?.value;
    const expectedValue = existingOrder.totals.subtotal;

    if (!capture || capture.status !== "COMPLETED") {
      return res.status(400).send("Pagamento não concluído.");
    }

    if (paidValue !== expectedValue) {
      return res.status(400).send(
        `Valor divergente. Esperado ${expectedValue}, recebido ${paidValue}.`
      );
    }

    const localOrderId = `ATL-${Date.now()}`;

    orders.set(orderId, {
      ...existingOrder,
      status: "PAID",
      paidAt: new Date().toISOString(),
      localOrderId,
      paypalCaptureId: capture.id,
      paypalStatus: capture.status,
      captureResponse: data
    });

    return res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pagamento aprovado</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; text-align: center; background: #faf7f1; color: #3A1E0E; }
          .box { max-width: 520px; margin: 60px auto; background: white; padding: 30px; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,.08); }
          a { display: inline-block; margin-top: 20px; text-decoration: none; background: #C9683A; color: white; padding: 12px 22px; border-radius: 999px; }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Pagamento aprovado</h1>
          <p>Seu pedido foi confirmado com sucesso.</p>
          <p><strong>Pedido:</strong> ${localOrderId}</p>
          <a href="/">Voltar para a loja</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Erro no retorno PayPal:", error);
    return res.status(500).send("Erro ao finalizar retorno do PayPal.");
  }
});

app.get("/paypal-cancel", (req, res) => {
  return res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Pagamento cancelado</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; text-align: center; background: #faf7f1; color: #3A1E0E; }
        .box { max-width: 520px; margin: 60px auto; background: white; padding: 30px; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,.08); }
        a { display: inline-block; margin-top: 20px; text-decoration: none; background: #C9683A; color: white; padding: 12px 22px; border-radius: 999px; }
      </style>
    </head>
    <body>
      <div class="box">
        <h1>Pagamento cancelado</h1>
        <p>Você cancelou o processo no PayPal.</p>
        <a href="/">Voltar para a loja</a>
      </div>
    </body>
    </html>
  `);
});

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "atelie-priscila-lima-profissional.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
});
