# Guia Rápido: GitHub + Render.com (Versão Web)

Passo-a-passo para conectar a versão web ao GitHub e fazer deploy no Render.com.

## Passo 1: Criar Repositório GitHub

### 1.1 Novo Repositório

1. Acesse https://github.com/new
2. **Repository name**: `sapl-voto-web`
3. **Description**: `Versão web do SAPL Votação Coité`
4. **Visibility**: Public
5. Clique em "Create repository"

### 1.2 Fazer Push do Código

```bash
cd /home/ubuntu/sapl-voto-web

# Inicializar git
git init

# Adicionar arquivos
git add .

# Commit
git commit -m "Initial commit: SAPL Votação Web"

# Renomear branch
git branch -M main

# Adicionar remote
git remote add origin https://github.com/seu-usuario/sapl-voto-web.git

# Push
git push -u origin main
```

## Passo 2: Conectar Render.com

### 2.1 Criar Conta Render

1. Acesse https://render.com
2. Clique em "Sign up"
3. Escolha "Sign up with GitHub"
4. Autorize o acesso
5. Complete o cadastro

### 2.2 Criar Static Site

1. Dashboard → "New +"
2. Selecione "Static Site"
3. Clique em "Connect a repository"
4. Autorize Render a acessar GitHub
5. Selecione `seu-usuario/sapl-voto-web`

### 2.3 Configurar Site

**Name**: `sapl-voto-web`

**Build Command**: 
```
pnpm install && pnpm build
```

**Publish Directory**: 
```
dist
```

**Plan**: Free

Clique em "Create Static Site"

## Passo 3: Adicionar Variáveis de Ambiente

1. Após criar o site, vá para "Environment"
2. Clique em "Add Environment Variable"
3. Adicione:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://sapl-voto-api.onrender.com` |

4. Clique em "Save"

## Passo 4: Deploy Automático

### 4.1 Verificar GitHub Actions

1. Vá para seu repositório GitHub
2. Aba "Actions"
3. Você deve ver o workflow "Deploy Web to Render"

### 4.2 Fazer Push para Ativar

```bash
# Fazer uma pequena alteração
echo "# Pronto para deploy" >> README.md

# Commit e push
git add README.md
git commit -m "test: verificar deploy automático"
git push origin main
```

### 4.3 Acompanhar Deploy

1. GitHub → Actions → Veja o workflow rodando
2. Render Dashboard → Deploys → Acompanhe o build

## Passo 5: Verificar Deploy

### 5.1 Acessar Aplicativo

Após sucesso, abra: `https://sapl-voto-web.onrender.com`

### 5.2 Testar Funcionalidades

1. Fazer login
2. Visualizar matérias
3. Registrar voto
4. Verificar placar

### 5.3 Verificar Logs

**GitHub Actions:**
- Repository → Actions → Último workflow

**Render:**
- Dashboard → sapl-voto-web → Logs

## Próximas Vezes

Agora que tudo está configurado:

```bash
# Fazer alterações
git add .
git commit -m "feat: adicionar nova funcionalidade"
git push origin main

# Deploy automático acontece automaticamente!
```

## Troubleshooting

### Build falha

1. Verificar logs no Render
2. Comum: falta de variáveis de ambiente
3. Solução: adicionar em "Environment"

### Página em branco

1. Abrir DevTools (F12)
2. Verificar console para erros
3. Verificar Network tab

### API não conecta

1. Verificar `VITE_API_URL` está correto
2. Confirmar backend está rodando
3. Verificar CORS

## Dúvidas Frequentes

**P: Como faço rollback?**
R: Render Dashboard → Deploys → Clique em "Redeploy" na versão anterior

**P: Como atualizar variáveis?**
R: Render Dashboard → Environment → Editar → Salvar (redeploy automático)

**P: Posso usar domínio customizado?**
R: Sim! Settings → Custom Domain

## Próximos Passos

1. ✅ Repositório GitHub criado
2. ✅ Render.com conectado
3. ✅ Deploy automático funcionando
4. [ ] Configurar domínio customizado (opcional)
5. [ ] Adicionar monitoramento (opcional)
6. [ ] Integrar com backend (já feito!)

## Suporte

- GitHub Issues: Abra uma issue
- Render Support: https://render.com/support
- Email: ednezio2@gmail.com

## Checklist Final

- [ ] Repositório GitHub criado
- [ ] Código fez push para main
- [ ] Render.com conectado
- [ ] Variáveis de ambiente configuradas
- [ ] Build passou
- [ ] Aplicativo acessível
- [ ] Login funciona
- [ ] Votação funciona
