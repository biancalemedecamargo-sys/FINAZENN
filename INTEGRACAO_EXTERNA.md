# Guia de Integração de Serviços Externos - FinanceZenn

Este documento fornece instruções passo a passo para integrar GitHub, OpenAI, Twilio e Fly.io ao projeto FinanceZenn.

---

## 1. GitHub - Versionamento de Código

### 1.1 Criar Repositório no GitHub

**Passo 1:** Acesse [github.com](https://github.com) e faça login (ou crie uma conta)

**Passo 2:** Clique em "New" para criar um novo repositório

**Passo 3:** Preencha os dados:
- **Repository name:** `financezenn`
- **Description:** "Dashboard Financeiro Low-Ticket - InfoSaaS"
- **Visibility:** Public (para portfólio) ou Private (para uso pessoal)
- **Initialize with README:** Não (já temos um)

**Passo 4:** Clique em "Create repository"

### 1.2 Conectar Repositório Local ao GitHub

```bash
cd /home/ubuntu/financezenn

# Inicializar git (se ainda não estiver)
git init

# Adicionar remote
git remote add origin https://github.com/SEU_USUARIO/financezenn.git

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit: FinanceZenn full-stack application"

# Fazer push para main
git branch -M main
git push -u origin main
```

### 1.3 GitHub Actions - CI/CD Automático

Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Fly.io

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

---

## 2. OpenAI - Análises com IA

### 2.1 Obter Chave API OpenAI

**Passo 1:** Acesse [platform.openai.com](https://platform.openai.com)

**Passo 2:** Clique em "Sign up" ou faça login

**Passo 3:** Vá para **API keys** no menu lateral

**Passo 4:** Clique em "Create new secret key"

**Passo 5:** Copie a chave (você não poderá vê-la novamente)

**Formato da chave:** `sk-...`

### 2.2 Adicionar Chave ao Projeto

Na interface de gerenciamento do Manus (Settings → Secrets), adicione:

```
OPENAI_API_KEY=sk-seu-chave-aqui
```

### 2.3 Integrar OpenAI no Backend

Instale a biblioteca:

```bash
cd /home/ubuntu/financezenn
pnpm add openai
```

Crie `server/services/ai.ts`:

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateFinancialInsight(data: {
  totalIncome: number;
  totalExpense: number;
  totalDebt: number;
  totalInvested: number;
  patrimonio: number;
}) {
  const prompt = `
    Analise os seguintes dados financeiros e forneça 3 recomendações práticas e acionáveis:
    
    - Renda Total: R$ ${(data.totalIncome / 100).toFixed(2)}
    - Despesa Total: R$ ${(data.totalExpense / 100).toFixed(2)}
    - Dívidas: R$ ${(data.totalDebt / 100).toFixed(2)}
    - Investimentos: R$ ${(data.totalInvested / 100).toFixed(2)}
    - Patrimônio: R$ ${(data.patrimonio / 100).toFixed(2)}
    
    Responda em português, de forma clara e direta.
  `;

  const message = await openai.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}
```

Adicione procedimento tRPC em `server/routers.ts`:

```typescript
aiInsights: protectedProcedure.query(async ({ ctx }) => {
  const userId = ctx.user.id;
  const summary = await trpc.dashboard.summary.useQuery();
  
  const insight = await generateFinancialInsight({
    totalIncome: summary.totalIncome,
    totalExpense: summary.totalExpense,
    totalDebt: summary.totalDebt,
    totalInvested: summary.totalInvested,
    patrimonio: summary.patrimonio,
  });
  
  return { insight };
}),
```

---

## 3. Twilio - Notificações por SMS/WhatsApp

### 3.1 Obter Credenciais Twilio

**Passo 1:** Acesse [twilio.com](https://www.twilio.com)

**Passo 2:** Clique em "Sign up" ou faça login

**Passo 3:** Verifique seu número de telefone

**Passo 4:** Vá para **Console** → **Account Info**

**Passo 5:** Copie:
- **Account SID:** `AC...`
- **Auth Token:** `seu-token-aqui`

**Passo 6:** Vá para **Phone Numbers** e compre um número Twilio

**Formato:** `+1234567890` (inclua o código do país)

### 3.2 Adicionar Credenciais ao Projeto

Na interface de gerenciamento (Settings → Secrets), adicione:

```
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=seu-token-aqui
TWILIO_PHONE_NUMBER=+1234567890
```

### 3.3 Integrar Twilio no Backend

Instale a biblioteca:

```bash
pnpm add twilio
```

Crie `server/services/notifications.ts`:

```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSMS(phoneNumber: string, message: string) {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('Erro ao enviar SMS:', error);
    return { success: false, error };
  }
}

export async function sendWhatsApp(phoneNumber: string, message: string) {
  try {
    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${phoneNumber}`,
    });
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error);
    return { success: false, error };
  }
}
```

Adicione procedimento tRPC em `server/routers.ts`:

```typescript
notifications: router({
  sendSMS: protectedProcedure
    .input(z.object({
      phoneNumber: z.string(),
      message: z.string(),
    }))
    .mutation(async ({ input }) => {
      return sendSMS(input.phoneNumber, input.message);
    }),
  
  sendWhatsApp: protectedProcedure
    .input(z.object({
      phoneNumber: z.string(),
      message: z.string(),
    }))
    .mutation(async ({ input }) => {
      return sendWhatsApp(input.phoneNumber, input.message);
    }),
}),
```

---

## 4. Fly.io - Deploy da Aplicação

### 4.1 Criar Conta no Fly.io

**Passo 1:** Acesse [fly.io](https://fly.io)

**Passo 2:** Clique em "Sign up"

**Passo 3:** Crie uma conta com email ou GitHub

**Passo 4:** Verifique seu email

**Passo 5:** Instale o CLI do Fly.io:

```bash
# macOS
brew install flyctl

# Linux
curl -L https://fly.io/install.sh | sh

# Windows (PowerShell)
pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### 4.2 Autenticar com Fly.io

```bash
flyctl auth login
```

Isso abrirá um navegador para você fazer login.

### 4.3 Criar Dockerfile

Crie `/home/ubuntu/financezenn/Dockerfile`:

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copiar código
COPY . .

# Build client e server
RUN pnpm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar package files
COPY package.json pnpm-lock.yaml ./

# Instalar apenas dependências de produção
RUN pnpm install --prod --frozen-lockfile

# Copiar arquivos compilados do builder
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server/dist ./server/dist

# Expor porta
EXPOSE 8080

# Comando de inicialização
CMD ["node", "server/dist/index.js"]
```

### 4.4 Criar fly.toml

```bash
cd /home/ubuntu/financezenn
flyctl launch
```

Responda às perguntas:
- **App name:** `financezenn` (ou outro nome único)
- **Region:** Escolha a região mais próxima (ex: `gig` para São Paulo)
- **Would you like to set up a Postgresql database?** Sim
- **Would you like to set up an upstash redis cache?** Não (opcional)

Isso criará `fly.toml`:

```toml
app = "financezenn"
primary_region = "gig"

[build]
  image = "financezenn:latest"

[env]
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true

[[services]]
  protocol = "tcp"
  internal_port = 8080

  [services.concurrency]
    type = "connections"
    hard_limit = 1000
    soft_limit = 800
```

### 4.5 Configurar Variáveis de Ambiente

```bash
# Adicionar DATABASE_URL
flyctl secrets set DATABASE_URL="postgresql://..."

# Adicionar JWT_SECRET
flyctl secrets set JWT_SECRET="seu-secret-super-seguro"

# Adicionar chaves de API
flyctl secrets set OPENAI_API_KEY="sk-..."
flyctl secrets set TWILIO_ACCOUNT_SID="AC..."
flyctl secrets set TWILIO_AUTH_TOKEN="..."
flyctl secrets set TWILIO_PHONE_NUMBER="+1234567890"
```

### 4.6 Deploy da Aplicação

```bash
# Deploy inicial
flyctl deploy

# Monitorar logs
flyctl logs

# Acessar a aplicação
flyctl open
```

---

## 5. Resumo das Chaves API Necessárias

| Serviço | Chave | Onde Obter | Formato |
|---------|-------|-----------|---------|
| **GitHub** | Personal Access Token | github.com/settings/tokens | `ghp_...` |
| **OpenAI** | API Key | platform.openai.com/api-keys | `sk-...` |
| **Twilio** | Account SID | twilio.com/console | `AC...` |
| **Twilio** | Auth Token | twilio.com/console | `token-aqui` |
| **Twilio** | Phone Number | twilio.com/console/phone-numbers | `+1234567890` |
| **Fly.io** | API Token | fly.io/user/personal_access_tokens | `FlyV1 ...` |

---

## 6. Próximos Passos

1. ✅ Criar repositório GitHub e fazer push do código
2. ✅ Configurar GitHub Actions para CI/CD automático
3. ✅ Integrar OpenAI para análises com IA
4. ✅ Configurar Twilio para notificações
5. ✅ Deploy no Fly.io com banco de dados PostgreSQL
6. ✅ Monitorar e escalar conforme necessário

---

## 7. Troubleshooting

### Erro: "Cannot find module 'openai'"
```bash
pnpm add openai
```

### Erro: "Twilio API Error"
Verifique se o número de telefone está no formato correto: `+55...` para Brasil

### Erro: "Fly.io deployment failed"
```bash
flyctl logs  # Ver logs de erro
flyctl status  # Ver status da aplicação
```

---

**Última atualização:** Outubro 2025

