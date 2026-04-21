# 🧶 Ateliê Priscila Lima - Checkout com Frete Automático

## 📋 Resumo das Otimizações

Seu checkout foi completamente otimizado com as seguintes melhorias:

### ✅ Integração de Frete Automático

- **Cálculo em tempo real** via Melhor Envio
- **Adição de opção "Cidades vizinhas"** para valores a combinar
- **Subtotal e Total separados** para melhor visualização
- **Frete integrado desde o carrinho** até o checkout final
- **Validação de CEP** com máscara e feedback visual

### ✅ Melhorias de UX/UI

- **Spinner de carregamento** durante cálculo de frete
- **Seleção de frete via radio buttons** com melhor visualização
- **Resumo de frete no modal de checkout**
- **Totais atualizados em tempo real**
- **Informações claras de PIX vs Cartão**

### ✅ Segurança e Performance

- **Validação de dados** no servidor e cliente
- **Tratamento robusto de erros**
- **Rate limiting** pronto para implementação
- **Logs estruturados** para debug

### ✅ Integração WhatsApp

- **Mensagem completa** com todos os detalhes do pedido
- **Incluindo frete selecionado**
- **Informações de pagamento estruturadas**
- **Dados do cliente formatados**

---

## 🚀 Como Implementar

### 1. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite `.env` com seus dados:

```env
MELHOR_ENVIO_TOKEN=seu_token_aqui
STORE_CEP=55820000
PORT=3000
NODE_ENV=production
```

**Como obter o token do Melhor Envio:**

1. Acesse https://www.melhorenvio.com.br/painel
2. Vá para **Configurações → API**
3. Gere um novo token
4. Copie e cole em `MELHOR_ENVIO_TOKEN`

### 2. Instalar Dependências

```bash
npm install express cors dotenv
```

### 3. Iniciar o Servidor

```bash
npm start
```

Ou em desenvolvimento:

```bash
npm run dev
```

---

## 📱 Fluxo do Checkout Otimizado

### Passo 1: Cliente Adiciona Produtos
- Produtos são adicionados ao carrinho
- Subtotal é calculado em tempo real
- Badge do carrinho atualiza

### Passo 2: Abrir Carrinho
- Cliente clica no botão do carrinho
- Vê seus produtos e subtotal
- Campo de CEP fica visível

### Passo 3: Calcular Frete
- Cliente insere CEP válido (8 dígitos)
- Clica em "Calcular"
- Sistema mostra as 3 melhores opções + "Cidades vizinhas"

### Passo 4: Selecionar Frete
- Cliente escolhe a opção de frete
- Total final é atualizado automaticamente
- Frete selecionado é exibido

### Passo 5: Finalizar Pedido
- Cliente clica em "Finalizar Pedido no WhatsApp"
- Modal de checkout abre com:
  - Resumo dos produtos
  - CEP selecionado
  - Frete escolhido
  - Formulário de cliente

### Passo 6: Confirmar Dados
- Cliente completa formulário
- Seleciona forma de pagamento (PIX/Cartão)
- Clica em "Enviar pedido no WhatsApp"
- Abre WhatsApp com mensagem completa

---

## 💻 Estrutura de Resposta da API de Frete

### Request (POST /api/frete)

```json
{
  "cep": "50810000",
  "items": [
    {
      "id": 1,
      "price": 30.00,
      "qty": 2
    },
    {
      "id": 2,
      "price": 25.00,
      "qty": 1
    }
  ]
}
```

### Response (Sucesso)

```json
[
  {
    "company": "Correios",
    "name": "PAC",
    "price": 15.50,
    "delivery_time": 7,
    "id": "correios_pac"
  },
  {
    "company": "Sedex",
    "name": "Sedex",
    "price": 35.20,
    "delivery_time": 2,
    "id": "sedex_sedex"
  },
  {
    "company": "Jadlog",
    "name": "Jadlog",
    "price": 18.90,
    "delivery_time": 5,
    "id": "jadlog_jadlog"
  }
]
```

### Response (Erro)

```json
{
  "error": "CEP inválido",
  "code": "INVALID_CEP"
}
```

---

## 🎨 Customizações Disponíveis

### 1. Adicionar Mais Opções de Frete

No `server.js`, altere `.slice(0, 3)` para o número desejado:

```javascript
.slice(0, 5) // Mostrar 5 opções em vez de 3
```

### 2. Alterar CEP da Loja

Edite `.env`:

```env
STORE_CEP=12345000
```

### 3. Mudar Peso Padrão dos Produtos

No `server.js`, altere `weight: 0.3`:

```javascript
weight: 0.5, // Aumentar para 500g
```

### 4. Adicionar Mais Dimensões

```javascript
products: items.map((item, index) => ({
  id: String(item.id || index),
  width: 25,      // cm
  height: 15,     // cm
  length: 20,     // cm
  weight: 0.5,    // kg
  insurance_value: Number(item.price) || 0,
  quantity: Math.max(1, parseInt(item.qty) || 1)
}))
```

---

## 📊 Lógica de Preços Implementada

### PIX (À Vista)
```javascript
Preço Final = Preço do Produto
Economia = Economia ao escolher PIX
```

### Cartão (6x sem juros)
```javascript
Taxa = 8.69%
Preço Final = Preço × (1 + 0.0869)
Parcela = Preço Final ÷ 6
```

### Total com Frete
```javascript
Total = Subtotal + Preço do Frete
(Para ambos PIX e Cartão)
```

---

## 🐛 Debug e Logs

O servidor exibe logs úteis:

```
[FRETE] CEP: 50810000 | Opções encontradas: 3
[FRETE] CEP: 55820000 | Opções encontradas: 2
[FRETE ERROR] Erro ao consultar transportadoras
```

Para ativar logs em desenvolvimento, adicione ao servidor:

```javascript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
  next();
});
```

---

## 🔒 Segurança Implementada

### Validações Client-Side
- ✅ Máscara de CEP (8 dígitos)
- ✅ Validação de email
- ✅ Campos obrigatórios
- ✅ Quantidade máxima de produtos (99)

### Validações Server-Side
- ✅ Validação de CEP (string + 8 dígitos)
- ✅ Validação de items (array não vazio)
- ✅ Preços sempre do banco de dados
- ✅ Limite de request body (20KB)
- ✅ Headers de segurança (X-Frame-Options, etc)
- ✅ CORS configurável

### Proteção de Dados
- ✅ Escapar HTML para prevenir XSS
- ✅ Dados de carrinho armazenados localmente
- ✅ Revalidação de preços contra catálogo
- ✅ Nenhum dado sensível em URLs

---

## 📦 Função: Cidades Vizinhas

A opção "Cidades vizinhas - Valores a combinar" foi adicionada automaticamente e:

- ✅ Aparece como última opção
- ✅ Não tem valor de frete associado
- ✅ Mostra "Sob consulta" em vez de preço
- ✅ Envia mensagem clara ao WhatsApp
- ✅ Permite que você confirme valores depois

---

## 🧪 Testar Localmente

### 1. Testar sem Melhor Envio

Você pode simular uma resposta:

```bash
curl -X POST http://localhost:3000/api/frete \
  -H "Content-Type: application/json" \
  -d '{"cep":"50810000","items":[{"id":1,"price":30,"qty":1}]}'
```

### 2. Testar com CEP Inválido

```bash
curl -X POST http://localhost:3000/api/frete \
  -H "Content-Type: application/json" \
  -d '{"cep":"123","items":[{"id":1,"price":30,"qty":1}]}'
```

---

## 📋 Checklist de Implementação

- [ ] Copiar arquivos atualizados (index.html, server.js)
- [ ] Criar arquivo `.env` com credenciais
- [ ] Obter token do Melhor Envio
- [ ] Instalar dependências (`npm install`)
- [ ] Testar frete com um CEP válido
- [ ] Testar checkout até WhatsApp
- [ ] Testar com diferentes formas de pagamento
- [ ] Testar responsividade mobile
- [ ] Configurar domínio em CORS (produção)
- [ ] Deploy no Render

---

## 🆘 Troubleshooting

### "Erro ao calcular frete"
- Verificar token do Melhor Envio
- Verificar se `.env` está configurado
- Verificar logs do servidor

### CEP não encontra opções
- Melhor Envio pode não atender essa região
- Verificar em melhorenvio.com.br manualmente
- Usar opção "Cidades vizinhas"

### Total não atualiza
- Abrir DevTools (F12)
- Verificar se há erros no console
- Recarregar página

### WhatsApp abre em branco
- Verificar número em `WHATSAPP_NUMBER`
- Adicionar +55 no código do país
- Verificar formato: 5581996809206

---

## 🎯 Próximas Melhorias

1. **Sistema de cupons de desconto**
   - Input no checkout
   - Validação de código
   - Aplicar desconto automaticamente

2. **Histórico de pedidos**
   - Salvar pedidos em banco de dados
   - Área do cliente
   - Download de recibos

3. **Notificação por email**
   - Confirmação de pedido
   - Rastreamento de entrega
   - Template responsivo

4. **Gateway de pagamento**
   - Integração com Stripe
   - Integração com PagSeguro
   - Boleto bancário

5. **Dashboard administrativo**
   - Visualizar pedidos
   - Gerenciar produtos
   - Relatórios de vendas

---

## 📞 Suporte

Para dúvidas:
- 📧 atelieplima@gmail.com
- 📱 WhatsApp: +55 81 99680-9206
- 📸 Instagram: @ateliepriscilalima26

---

**Desenvolvido com ❤️ para o Ateliê Priscila Lima**
