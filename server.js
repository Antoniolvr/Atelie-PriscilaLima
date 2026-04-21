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

// Middlewares de Segurança
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

app.use(cors());
app.use(express.json({ limit: "20kb" }));

// Rota de Frete Corrigida
app.post('/api/frete', async (req, res) => {
  try {
    const { cep, items } = req.body;

    if (!cep || cep.length !== 8) {
      return res.status(400).json({ error: 'CEP inválido' });
    }

    const response = await fetch('https://www.melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'AteliePriscilaLima (email: atelieplima@gmail.com)'
      },
      body: JSON.stringify({
        from: { postal_code: "55820000" },
        to: { postal_code: cep },
        products: items.map(item => ({
          id: String(item.id),
          width: 20, height: 10, length: 15, weight: 0.3,
          insurance_value: item.price,
          quantity: item.qty
        }))
      })
    });

    const data = await response.json();

    // Filtra e formata os dados
    if (!Array.isArray(data)) return res.json([]);

    const fretesProcessados = data
      .filter(f => f && f.price && !isNaN(parseFloat(f.price))) // Remove NaN e inválidos
      .map(f => ({
        company: f.company?.name || 'Transportadora',
        name: f.name || 'Envio',
        price: parseFloat(f.price),
        delivery_time: f.delivery_time || 0
      }))
      .sort((a, b) => a.price - b.price) // Ordena do mais barato ao mais caro
      .slice(0, 3); // Pega apenas os 3 primeiros

    res.json(fretesProcessados);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao calcular frete' });
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
