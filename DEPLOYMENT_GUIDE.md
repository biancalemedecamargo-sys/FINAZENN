# Guia de Deploy - FinanceZenn

Este guia fornece instruções passo a passo para fazer deploy do FinanceZenn no Fly.io com GitHub Actions.

---

## 1. Preparação Inicial

### 1.1 Criar Repositório no GitHub

```bash
cd /home/ubuntu/financezenn
git init
git add .
git commit -m "Initial commit: FinanceZenn full-stack application"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/financezenn.git
git push -u origin main
```

### 1.2 Instalar Fly CLI

**macOS:**
```bash
brew install flyctl
```

**Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

**Windows (PowerShell):**
```powershell
pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### 1.3 Autenticar com Fly.io

```bash
flyctl auth login
```

---

## 2. Configurar Fly.io

### 2.1 Criar Aplicação no Fly.io

```bash
cd /home/ubuntu/financezenn
flyctl launch
```

Responda às perguntas:
- **App name:** `financezenn` (ou outro nome único)
- **Region:** `gig` (São Paulo) ou outra região
- **Would you like to set up a Postgresql database?** Sim
- **Would you like to set up an upstash redis cache?** Não

Isso criará o arquivo `fly.toml` (já incluído no projeto).

### 2.2 Criar Banco de Dados PostgreSQL

Se não foi criado automaticamente:

```bash
flyctl postgres create
```

Copie a connection string retornada.

### 2.3 Configurar Variáveis de Ambiente

```bash
# Adicionar DATABASE_URL
flyctl secrets set DATABASE_URL="postgresql://seu-usuario:sua-senha@seu-host:5432/financezenn"

# Adicionar JWT_SECRET
flyctl secrets set JWT_SECRET="seu-secret-super-seguro-aqui"

# Adicionar OpenAI API Key
flyctl secrets set OPENAI_API_KEY="sk-proj-sua-chave-aqui"

# Adicionar Twilio credentials
flyctl secrets set TWILIO_ACCOUNT_SID="AC2609b06c72aded7846d9afa2034b833a"
flyctl secrets set TWILIO_AUTH_TOKEN="wxQWDazMCAQD4YlIZfkt7GogwKtoARGY"
flyctl secrets set TWILIO_PHONE_NUMBER="+1234567890"

# Adicionar Hotmart link
flyctl secrets set HOTMART_LINK="https://biancalemedecamargo.hotmart.host/p/seu-produto"
```

### 2.4 Verificar Secrets

```bash
flyctl secrets list
```

---

## 3. Configurar GitHub Actions

### 3.1 Adicionar FLY_API_TOKEN ao GitHub

1. Gere um token no Fly.io:
```bash
flyctl auth token
```

2. Vá para seu repositório GitHub → Settings → Secrets and variables → Actions

3. Clique em "New repository secret"

4. Nome: `FLY_API_TOKEN`
   Valor: Cole o token gerado

### 3.2 Verificar Workflow

O arquivo `.github/workflows/deploy.yml` já está configurado. Ele fará:
- Testes e lint em cada push
- Build da aplicação
- Deploy automático para Fly.io quando fizer push para main

---

## 4. Deploy Manual

Se preferir fazer deploy manualmente:

```bash
# Build local
pnpm run build

# Deploy
flyctl deploy

# Monitorar logs
flyctl logs

# Acessar a aplicação
flyctl open
```

---

## 5. Monitoramento e Troubleshooting

### 5.1 Ver Logs

```bash
flyctl logs
```

### 5.2 Ver Status da Aplicação

```bash
flyctl status
```

### 5.3 SSH na Máquina

```bash
flyctl ssh console
```

### 5.4 Reiniciar Aplicação

```bash
flyctl restart
```

### 5.5 Escalar Máquinas

```bash
flyctl scale count 2  # Aumentar para 2 instâncias
```

---

## 6. Domínio Personalizado

### 6.1 Adicionar Domínio

```bash
flyctl certs create seu-dominio.com
```

### 6.2 Configurar DNS

Siga as instruções fornecidas pelo Fly.io para apontar seu domínio.

---

## 7. Backup e Recuperação

### 7.1 Backup do Banco de Dados

```bash
flyctl postgres backup create
```

### 7.2 Listar Backups

```bash
flyctl postgres backups list
```

### 7.3 Restaurar Backup

```bash
flyctl postgres restore <backup-id>
```

---

## 8. Troubleshooting Comum

### Erro: "Cannot find module 'openai'"
```bash
pnpm install
pnpm run build
flyctl deploy --remote-only
```

### Erro: "DATABASE_URL not set"
```bash
flyctl secrets set DATABASE_URL="postgresql://..."
flyctl restart
```

### Erro: "Port 8080 not responding"
Verifique se a aplicação está iniciando corretamente:
```bash
flyctl logs
```

### Erro: "Twilio credentials invalid"
Verifique as credenciais:
```bash
flyctl secrets list
```

---

## 9. Próximos Passos

1. ✅ Fazer push do código para GitHub
2. ✅ GitHub Actions fará deploy automático
3. ✅ Monitorar logs com `flyctl logs`
4. ✅ Acessar a aplicação com `flyctl open`
5. ✅ Configurar domínio personalizado (opcional)

---

## 10. Referências

- [Fly.io Documentation](https://fly.io/docs/)
- [Fly.io CLI Reference](https://fly.io/docs/reference/flyctl-commands/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [PostgreSQL on Fly.io](https://fly.io/docs/postgres/)

---

**Última atualização:** Outubro 2025

