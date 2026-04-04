# Ateliê Priscila Lima — versão profissional com backend

## O que foi implementado
- Frontend com carrinho e checkout
- Criação do pedido PayPal no backend
- Captura do pagamento no backend
- Validação de carrinho no servidor
- Validação de cliente no servidor
- Conferência do valor pago antes de confirmar o pedido
- Endpoint de healthcheck
- Estrutura pronta para evoluir para banco de dados e webhook completo

## Estrutura
- `server.js` → backend Node.js/Express
- `public/atelie-priscila-lima-profissional.html` → frontend
- `.env.example` → variáveis de ambiente
- `package.json` → dependências e scripts

## Como usar

### 1) Instale as dependências
```bash
npm install
```

### 2) Crie o arquivo `.env`
Copie `.env.example` para `.env` e preencha:
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`

### 3) Configure o frontend
Abra `public/atelie-priscila-lima-profissional.html` e substitua:
```js
const PAYPAL_CLIENT_ID = 'COLOQUE_SEU_CLIENT_ID_AQUI';
```

### 4) Rode o projeto
```bash
npm start
```

### 5) Abra no navegador
```text
http://localhost:3000
```

## Importante
- Para testes, use conta sandbox do PayPal.
- Em produção, troque `PAYPAL_ENV=sandbox` para `PAYPAL_ENV=live`.
- O `orders` está em memória. Para produção real, use banco de dados.
- O webhook está básico e deve ser validado com a assinatura do PayPal em ambiente real.
- O catálogo do backend é a fonte da verdade. Se mudar preço no frontend, mude também no `CATALOG` do `server.js`.

## Próximos upgrades recomendados
- banco de dados
- painel administrativo
- cálculo de frete
- envio de e-mail pós-compra
- assinatura de webhook do PayPal
- estoque
