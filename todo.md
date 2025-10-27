# FinanceZenn - Project TODO

## Backend (server/)

### Database Schema
- [x] Definir schema completo (User, Transaction, Investment, Debt, Goal, Params)
- [x] Implementar migrações Drizzle ORM

### Autenticação
- [x] Implementar rota /auth/register (via Manus OAuth)
- [x] Implementar rota /auth/login (via Manus OAuth)
- [x] Implementar JWT middleware

### Rotas CRUD
- [x] Implementar rotas de Transações (/api/transactions)
- [x] Implementar rotas de Investimentos (/api/investments)
- [x] Implementar rotas de Dívidas (/api/debts)
- [x] Implementar rotas de Metas (/api/goals)
- [x] Implementar rotas de Parâmetros (/api/params)

## Frontend (client/)

### Estrutura e Contexto
- [x] Integrar fetch de dados da API do backend via tRPC
- [x] Implementar autenticação no frontend

### Componentes de UI
- [x] Criar componentes com glassmorphism
- [x] Implementar paleta neuroeconômica
- [x] Adicionar animações e transições

### Páginas
- [x] Implementar Dashboard.tsx (visão geral)
- [x] Implementar Transactions.tsx (CRUD de transações)
- [x] Implementar Investments.tsx (CRUD de investimentos)
- [x] Implementar Debts.tsx (CRUD de dívidas)
- [x] Implementar Goals.tsx (CRUD de metas)
- [x] Implementar Insights.tsx (análises e recomendações)
- [x] Implementar Config.tsx (configurações de usuário)
- [x] Implementar Home.tsx (landing page)

### Estilo e Tema
- [x] Implementar paleta neuroeconômica (dark mode)
- [x] Configurar Tailwind CSS com shadcn/ui
- [x] Adicionar fontes (Inter, Plus Jakarta Sans, JetBrains Mono)
- [x] Implementar animações CSS

## Marketing e Landing Page

### Landing Page
- [x] Criar landing page baseada na "Guia Estratégico do Futuro Financeiro"
- [x] Implementar narrativa de "Renascimento e Foco na Dor"
- [x] Adicionar CTA "Começar Agora" com preço

### Conteúdo
- [ ] Preparar conteúdo do ebook "S.O.S Dívidas"
- [ ] Criar seções de Rastreamento de Juros, Negociação, Reserva

### Funil de Vendas
- [ ] Simular integração com Manychat/Kommo (automação de DMs)
- [ ] Preparar fluxo de Upsell 1 (Renascimento Financeiro - R$ 197)
- [ ] Preparar fluxo de Downsell 1 (Simplificado - R$ 97)

## Deploy (Fly.io)

### Configuração
- [ ] Configurar package.json com scripts de build
- [ ] Criar Dockerfile multi-stage
- [ ] Criar fly.toml com configurações
- [ ] Preparar variáveis de ambiente (DATABASE_URL, JWT_SECRET, etc.)

### Testes
- [ ] Testar build local (npm run build)
- [ ] Testar servidor de produção (npm start)
- [ ] Validar integração frontend + backend

## Conclusão
- [ ] Revisar e testar aplicação full-stack
- [ ] Preparar documentação para deploy no Fly.io
- [ ] Entregar projeto ao usuário

