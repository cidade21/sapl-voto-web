# SAPL Votação Coité - Resumo do Projeto Web

## Status: ✅ Pronto para Deploy

### Versão Web Completa

**Versão**: 1.0.0  
**Build**: 836 KB (minificado)  
**Status**: Compilação OK, Testes OK, Build OK

## Arquitetura

```
Frontend (React + TypeScript)  ←→  Backend (Node.js + tRPC)
sapl-voto-web                      sapl-voto-mobile/server
```

## Funcionalidades Implementadas

### Para Parlamentares
- ✅ Login com e-mail e senha
- ✅ Visualizar matérias pautadas
- ✅ Votação em tempo real (Sim/Não/Abstenção)
- ✅ Placar atualizado a cada 2 segundos
- ✅ Gráfico de resultados
- ✅ Histórico de votos

### Para Operadores
- ✅ Dashboard de controle
- ✅ Criar nova sessão
- ✅ Gerenciar matérias
- ✅ Monitorar votações
- ✅ Ver relatórios

## Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| React | 18.2.0 | Framework UI |
| TypeScript | 5.9.3 | Type safety |
| Vite | 5.4.21 | Build tool |
| React Router | 6.20.0 | Roteamento |
| Zustand | 4.4.0 | State management |
| Axios | 1.6.0 | HTTP client |
| Recharts | 2.10.0 | Gráficos |
| TanStack Query | 5.28.0 | Data fetching |

## Estrutura de Arquivos

```
src/
├── pages/
│   ├── Login.tsx                 # Página de autenticação
│   ├── ParlamentarHome.tsx       # Home do parlamentar
│   ├── MateriaDetail.tsx         # Detalhe da matéria com votação
│   └── OperadorHome.tsx          # Home do operador
├── components/
│   ├── Layout.tsx                # Layout principal
│   └── ProtectedRoute.tsx        # Rota protegida
├── store/
│   ├── authStore.ts              # Store de autenticação
│   └── votacaoStore.ts           # Store de votação
├── services/
│   └── api.ts                    # Cliente de API
├── types/
│   └── index.ts                  # Tipos TypeScript
├── styles/
│   └── index.css                 # Estilos globais
├── App.tsx                       # Componente raiz
└── main.tsx                      # Entrada
```

## Endpoints de API Utilizados

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/trpc/auth.login` | POST | Login |
| `/api/trpc/auth.me` | GET | Dados do usuário |
| `/api/trpc/votacao.sessao.ativa` | GET | Sessão ativa |
| `/api/trpc/votacao.materia.listarSessao` | GET | Matérias da sessão |
| `/api/trpc/votacao.voto.registrar` | POST | Registrar voto |
| `/api/trpc/votacao.voto.placar` | GET | Placar da matéria |

## Deploy

### Render.com

```
Frontend: https://sapl-voto-web.onrender.com
Backend:  https://sapl-voto-api.onrender.com
```

### Configuração

- **Build Command**: `pnpm install && pnpm build`
- **Publish Directory**: `dist`
- **Environment**: `VITE_API_URL=https://sapl-voto-api.onrender.com`

## Performance

- Build size: 836 KB
- Gzip: ~242 KB
- Lazy loading de rotas
- Cache de dados
- Polling a cada 2 segundos

## Segurança

- ✅ Autenticação JWT
- ✅ Token em localStorage
- ✅ Validação de entrada
- ✅ CORS configurado
- ✅ HTTPS em produção

## Testes

```bash
# Type check
pnpm type-check

# Lint
pnpm lint

# Build
pnpm build

# Preview
pnpm preview
```

## Próximos Passos

1. [ ] Integração com WebSocket para placar em tempo real
2. [ ] Exportar resultados em PDF
3. [ ] Relatórios detalhados
4. [ ] Suporte a múltiplas câmaras
5. [ ] Integração com assinatura digital
6. [ ] App mobile nativa

## Documentação

- [README.md](./README.md) - Visão geral
- [SETUP.md](./SETUP.md) - Setup local
- [DEPLOY.md](./DEPLOY.md) - Deploy em produção
- [GITHUB_RENDER_SETUP.md](./GITHUB_RENDER_SETUP.md) - Integração GitHub + Render

## Suporte

- GitHub Issues
- Email: ednezio2@gmail.com
- Render Support: https://render.com/support

## Licença

Desenvolvido para a Câmara de Conceição do Coité.
