# SAPL Votação Coité - Versão Web

Versão web do sistema de votação online integrado ao SAPL para a Câmara de Conceição do Coité.

## Características

- **Interface responsiva** - Funciona em desktop, tablet e mobile
- **Votação em tempo real** - Placar atualizado a cada 2 segundos
- **Autenticação segura** - Login com credenciais do SAPL
- **Dois perfis de usuário**:
  - **Parlamentar**: Votação nas matérias pautadas
  - **Operador**: Gerenciamento de sessões e monitoramento

## Tecnologias

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Roteamento
- **Zustand** - State management
- **Axios** - HTTP client
- **Recharts** - Visualização de dados
- **TanStack Query** - Data fetching

## Instalação

### Pré-requisitos

- Node.js 18+
- pnpm 9+

### Setup Local

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Editar .env.local com a URL da API
# VITE_API_URL=http://localhost:3000

# Iniciar servidor de desenvolvimento
pnpm dev
```

O aplicativo estará disponível em `http://localhost:5173`

## Estrutura do Projeto

```
src/
├── pages/              # Páginas da aplicação
│   ├── Login.tsx
│   ├── ParlamentarHome.tsx
│   ├── MateriaDetail.tsx
│   ├── OperadorHome.tsx
│   └── ...
├── components/         # Componentes reutilizáveis
│   ├── Layout.tsx
│   ├── ProtectedRoute.tsx
│   └── ...
├── store/             # Estado global (Zustand)
│   ├── authStore.ts
│   └── votacaoStore.ts
├── services/          # Serviços de API
│   └── api.ts
├── types/             # Tipos TypeScript
│   └── index.ts
├── styles/            # Estilos globais
│   └── index.css
├── App.tsx            # Componente raiz
└── main.tsx           # Entrada da aplicação
```

## Uso

### Para Parlamentares

1. Fazer login com e-mail e senha
2. Visualizar matérias pautadas na sessão ativa
3. Clicar em uma matéria para ver detalhes
4. Registrar voto: Sim, Não ou Abstenção
5. Visualizar placar em tempo real

### Para Operadores

1. Fazer login com credenciais de operador
2. Criar nova sessão (data, hora, descrição)
3. Iniciar votação (envia e-mail aos vereadores)
4. Monitorar placar em tempo real
5. Encerrar votação

## Desenvolvimento

### Adicionar Nova Página

```typescript
// src/pages/NovaPage.tsx
import React from 'react';
import { Layout } from '@/components/Layout';

export const NovaPage: React.FC = () => {
  return (
    <Layout title="Minha Página">
      <div>Conteúdo aqui</div>
    </Layout>
  );
};
```

### Adicionar Rota

```typescript
// src/App.tsx
<Route
  path="/nova-rota"
  element={
    <ProtectedRoute requiredRole="parlamentar">
      <NovaPage />
    </ProtectedRoute>
  }
/>
```

### Usar Store

```typescript
import { useAuthStore } from '@/store/authStore';
import { useVotacaoStore } from '@/store/votacaoStore';

const { user, logout } = useAuthStore();
const { sessaoAtiva, materias } = useVotacaoStore();
```

## Build

```bash
# Build para produção
pnpm build

# Preview do build
pnpm preview
```

## Deploy

### Render.com

1. Conectar repositório GitHub ao Render
2. Criar novo Static Site
3. Build Command: `pnpm install && pnpm build`
4. Publish Directory: `dist`
5. Adicionar variável de ambiente:
   ```
   VITE_API_URL=https://sapl-voto-api.onrender.com
   ```

## Troubleshooting

### Erro: "API não conecta"

- Verificar se `VITE_API_URL` está correto
- Confirmar que o servidor backend está rodando
- Verificar CORS no backend

### Erro: "Autenticação falha"

- Verificar credenciais
- Confirmar que o usuário existe no banco de dados
- Verificar token JWT

### Placar não atualiza

- Verificar conexão com internet
- Recarregar página
- Verificar console do navegador para erros

## Performance

- Polling a cada 2 segundos para placar
- Cache de dados com React Query
- Lazy loading de rotas
- Compressão de assets

## Segurança

- Autenticação via JWT
- Token armazenado em localStorage
- HTTPS em produção
- Validação de entrada
- CORS configurado

## Contribuindo

1. Criar branch para feature: `git checkout -b feature/minha-feature`
2. Commit changes: `git commit -m "feat: adicionar feature"`
3. Push para branch: `git push origin feature/minha-feature`
4. Abrir Pull Request

## Roadmap

- [ ] Integração com WebSocket para placar em tempo real
- [ ] Exportar resultados em PDF
- [ ] Relatórios detalhados
- [ ] Suporte a múltiplas câmaras
- [ ] Integração com assinatura digital
- [ ] App mobile nativa

## Suporte

Para dúvidas ou problemas, abra uma issue no GitHub.

## Licença

Desenvolvido para a Câmara de Conceição do Coité.
