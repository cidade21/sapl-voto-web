# Guia de Deploy - SAPL Votação Coité Web

Este documento descreve como fazer deploy da versão web no Render.com.

## Pré-requisitos

- Repositório GitHub com o código
- Conta Render.com
- Conta Google (ednezio2@gmail.com)

## Arquitetura

A versão web é um **Static Site** que se conecta à API backend:

```
Frontend (Static Site)  ←→  Backend API (Node.js)
https://sapl-voto-web      https://sapl-voto-api
```

## Passo 1: Preparar Repositório GitHub

### 1.1 Criar Repositório

```bash
cd /home/ubuntu/sapl-voto-web
git init
git add .
git commit -m "Initial commit: SAPL Votação Web"
git branch -M main
git remote add origin https://github.com/seu-usuario/sapl-voto-web.git
git push -u origin main
```

### 1.2 Criar Branch de Desenvolvimento

```bash
git checkout -b develop
git push -u origin develop
```

## Passo 2: Configurar Render.com

### 2.1 Conectar GitHub

1. Acesse https://dashboard.render.com
2. Clique em "New +" → "Static Site"
3. Selecione "Connect a repository"
4. Autorize com GitHub
5. Selecione `seu-usuario/sapl-voto-web`

### 2.2 Configurar Static Site

**Nome**: `sapl-voto-web`

**Configurações**:
- **Build Command**: `pnpm install && pnpm build`
- **Publish Directory**: `dist`
- **Plan**: Free

### 2.3 Adicionar Variáveis de Ambiente

No Render, vá para "Environment" e adicione:

```
VITE_API_URL=https://sapl-voto-api.onrender.com
```

## Passo 3: Deploy Automático

### 3.1 Configurar GitHub Actions

O arquivo `.github/workflows/deploy.yml` já está configurado para:

1. Rodar testes em cada push
2. Fazer build
3. Fazer deploy automático em `main`

### 3.2 Fazer Push para Ativar Deploy

```bash
git add .
git commit -m "Deploy: versão web pronta"
git push origin main
```

O Render detectará o push e iniciará o build automaticamente.

## Passo 4: Verificar Deploy

### 4.1 Acompanhar Build

1. No Render Dashboard, abra `sapl-voto-web`
2. Vá para "Deploys"
3. Acompanhe o progresso do build

### 4.2 Acessar Aplicativo

Após sucesso, acesse: `https://sapl-voto-web.onrender.com`

### 4.3 Verificar Logs

1. Render Dashboard → Logs
2. Procure por erros de build

## Troubleshooting

### Build falha com erro de dependências

```bash
# Limpar cache local
rm -rf node_modules pnpm-lock.yaml

# Reinstalar
pnpm install

# Build local para testar
pnpm build
```

### Erro: "Cannot find module"

1. Verificar `tsconfig.json`
2. Confirmar imports estão corretos
3. Executar `pnpm type-check` localmente

### API não conecta

1. Verificar `VITE_API_URL` está correto no Render
2. Confirmar backend está rodando
3. Verificar CORS no backend

### Página em branco

1. Abrir DevTools (F12)
2. Verificar console para erros
3. Verificar Network tab para requisições falhadas

## Monitoramento

### Logs

- Render Dashboard → Logs
- GitHub Actions → Actions → Workflow

### Métricas

- Render Dashboard → Metrics
- Tempo de build
- Requisições HTTP

## Atualizações

### Fazer Update

```bash
git add .
git commit -m "feat: adicionar nova funcionalidade"
git push origin main
# Deploy automático acionado
```

### Rollback

1. Render Dashboard → Deploys
2. Clique em "Redeploy" na versão anterior

## Domínio Customizado (Opcional)

1. Render Dashboard → sapl-voto-web → Settings
2. Vá para "Custom Domain"
3. Adicione seu domínio
4. Configure DNS no registrador

## SSL/TLS

Render.com fornece SSL automaticamente para domínios `.onrender.com`.

Para domínios customizados:
1. Render configura automaticamente
2. Certificado renovado a cada 90 dias

## Performance

### Otimizações Implementadas

- Minificação de assets
- Compressão de imagens
- Lazy loading de componentes
- Cache de dados

### Melhorias Futuras

- CDN global
- Service Workers
- Progressive Web App (PWA)
- Compressão Brotli

## Segurança

- HTTPS em produção
- CORS configurado
- Validação de entrada
- Headers de segurança

## Backup e Recuperação

### Backup do Código

```bash
# GitHub é o backup
git push origin main
```

### Recuperar Versão Anterior

1. Render Dashboard → Deploys
2. Clique em "Redeploy" na versão desejada

## Próximos Passos

- [ ] Configurar domínio customizado
- [ ] Adicionar monitoramento (Sentry)
- [ ] Implementar PWA
- [ ] Adicionar analytics
- [ ] Configurar backups automáticos

## Suporte

Para dúvidas:
- GitHub Issues
- Render Support: https://render.com/support
- Email: ednezio2@gmail.com

## Checklist de Deploy

- [ ] Código está em GitHub
- [ ] Render.com conectado
- [ ] Variáveis de ambiente configuradas
- [ ] Build passou localmente
- [ ] Deploy automático funcionando
- [ ] Aplicativo acessível em produção
- [ ] API conecta corretamente
- [ ] Login funciona
- [ ] Votação funciona
