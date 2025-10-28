# 💰 FINAZENN - Dashboard Financeiro Low-Ticket

**Transforme sua relação com o dinheiro usando Inteligência Artificial!**

FINAZENN é um aplicativo **InfoSaaS full-stack** para gestão de finanças pessoais, focado no público low-ticket endividado brasileiro. Combine tecnologia, psicologia financeira e IA para conquistar seu renascimento financeiro.

---

## 🎯 Características Principais

### 📊 Dashboard Inteligente
- **Métricas em Tempo Real:** Saldo, Patrimônio, Dívidas Totais, Progresso de Metas
- **Transações Recentes:** Histórico de movimentações financeiras
- **Dica do Dia:** Recomendações personalizadas baseadas em IA
- **Ações Rápidas:** Acesso rápido às principais funcionalidades

### 💳 Gestão de Transações
- Registre receitas e despesas com categorização
- Visualize tendências de gastos
- Exporte relatórios em PDF

### 💼 Investimentos
- Acompanhe seu portfólio de investimentos
- Calcule ganhos e perdas em tempo real
- Receba recomendações de diversificação com IA

### 💸 Controle de Dívidas
- Registre todas as suas dívidas
- Calcule juros estimados
- Gere planos de quitação com IA (método avalanche/bola de neve)
- Receba notificações de dívidas vencendo

### 🎯 Metas Financeiras
- Defina metas de curto e longo prazo
- Acompanhe progresso com barras visuais
- Receba notificações ao atingir metas

### 🤖 Análises com IA (OpenAI)
- **Insights Personalizados:** Análises baseadas em seus dados financeiros
- **Planos de Quitação:** Estratégias inteligentes para eliminar dívidas
- **Recomendações de Investimento:** Sugestões de otimização de portfólio

### 📱 Notificações (Twilio)
- **SMS/WhatsApp:** Alertas de dívidas vencendo, metas atingidas, insights diários
- **Reserva de Emergência:** Lembretes para manter fundo de emergência

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** com Vite
- **TypeScript** para type safety
- **Tailwind CSS 4** para estilo
- **shadcn/ui** para componentes
- **Wouter** para roteamento
- **tRPC** para comunicação com backend

### Backend
- **Node.js 22** com Express
- **TypeScript** para type safety
- **Drizzle ORM** para banco de dados
- **PostgreSQL** para persistência
- **tRPC** para API type-safe

### Integrações Externas
- **OpenAI (GPT-4o-mini):** Análises inteligentes
- **Twilio:** Notificações SMS/WhatsApp
- **Manus OAuth:** Autenticação segura
- **Fly.io:** Deploy e hospedagem

---

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 22+
- pnpm (ou npm/yarn)
- PostgreSQL 14+

### Instalação Local

```bash
# Clone o repositório
git clone https://github.com/biancalemedecamargo-sys/FINAZENN.git
cd FINAZENN

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Edite .env.local com suas credenciais:
# - DATABASE_URL (PostgreSQL)
# - OPENAI_API_KEY
# - TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
# - JWT_SECRET

# Execute as migrações do banco de dados
pnpm db:push

# Inicie o servidor de desenvolvimento
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`

---

## 📦 Estrutura do Projeto

```
FINAZENN/
├── client/                 # Frontend React + Vite
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── contexts/      # React Contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilitários (tRPC client)
│   │   ├── App.tsx        # Roteamento principal
│   │   └── main.tsx       # Entry point
│   └── index.html
├── server/                # Backend Node.js + Express
│   ├── services/          # Serviços (OpenAI, Twilio)
│   ├── db.ts              # Query helpers
│   ├── routers.ts         # Procedimentos tRPC
│   └── _core/             # Framework plumbing
├── drizzle/               # Schema e migrations
│   └── schema.ts          # Definições de tabelas
├── Dockerfile             # Build multi-stage
├── fly.toml               # Configuração Fly.io
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions CI/CD
└── package.json
```

---

## 🔧 Variáveis de Ambiente

```env
# Banco de Dados
DATABASE_URL=postgresql://user:password@localhost:5432/finazenn

# Autenticação
JWT_SECRET=seu-secret-super-seguro

# OpenAI
OPENAI_API_KEY=sk-proj-sua-chave-aqui

# Twilio
TWILIO_ACCOUNT_SID=seu-account-sid
TWILIO_AUTH_TOKEN=seu-auth-token
TWILIO_PHONE_NUMBER=+seu-numero

# Hotmart (opcional)
HOTMART_LINK=seu-link-hotmart
```

---

## 🚢 Deploy no Fly.io

### 1. Criar Conta e Instalar CLI

```bash
# Instalar Fly CLI
curl -L https://fly.io/install.sh | sh

# Autenticar
flyctl auth login
```

### 2. Criar Aplicação

```bash
flyctl launch
# Responda às perguntas (criar PostgreSQL, etc)
```

### 3. Configurar Secrets

```bash
flyctl secrets set DATABASE_URL="postgresql://..."
flyctl secrets set OPENAI_API_KEY="sk-proj-..."
flyctl secrets set TWILIO_ACCOUNT_SID="AC..."
flyctl secrets set TWILIO_AUTH_TOKEN="..."
flyctl secrets set TWILIO_PHONE_NUMBER="+..."
flyctl secrets set JWT_SECRET="seu-secret"
```

### 4. Deploy

```bash
flyctl deploy
```

**GitHub Actions fará deploy automático** a cada push para `master`!

---

## 📊 Páginas da Aplicação

| Página | Descrição |
|--------|-----------|
| **Dashboard** | Visão geral financeira com métricas e ações rápidas |
| **Transações** | CRUD de receitas e despesas |
| **Investimentos** | Gestão de portfólio com análises |
| **Dívidas** | Rastreamento e planos de quitação |
| **Metas** | Definição e acompanhamento de objetivos |
| **Insights** | Análises com IA e recomendações |
| **Config** | Configurações do usuário |
| **Home** | Landing page pública |

---

## 🔐 Segurança

- ✅ Autenticação OAuth com Manus
- ✅ Senhas hasheadas com JWT
- ✅ Secrets seguros com Fly.io
- ✅ HTTPS em produção
- ✅ CORS configurado
- ✅ Validação de entrada em todas as rotas

---

## 📈 Roadmap

- [ ] Integração com Hotmart para vender eBook "Finance IA"
- [ ] Análises com gráficos avançados
- [ ] Exportação de relatórios em PDF
- [ ] App mobile (React Native)
- [ ] Integração com Open Banking (PIX)
- [ ] Chatbot com IA para suporte
- [ ] Gamificação (badges, achievements)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.

---

## 📧 Contato

- **Email:** bianca@finazenn.com
- **GitHub:** [@biancalemedecamargo-sys](https://github.com/biancalemedecamargo-sys)
- **Website:** https://finazenn.fly.dev

---

## 🙏 Agradecimentos

- [OpenAI](https://openai.com/) por GPT-4o-mini
- [Twilio](https://www.twilio.com/) por SMS/WhatsApp
- [Fly.io](https://fly.io/) por hospedagem
- [Manus](https://manus.im/) por OAuth e infraestrutura

---

**Feito com ❤️ para transformar vidas financeiras**

---

## 📚 Documentação Adicional

- [Guia de Deploy](./DEPLOYMENT_GUIDE.md)
- [Integração com Serviços Externos](./INTEGRACAO_EXTERNA.md)
- [Contribuindo ao Projeto](./CONTRIBUTING.md)

---

**Última atualização:** Outubro 2025

