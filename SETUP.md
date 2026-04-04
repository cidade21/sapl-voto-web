# Setup Local - SAPL Votação Coité Web

Instruções para configurar o ambiente de desenvolvimento local da versão web.

## Pré-requisitos

- Node.js 18+ (https://nodejs.org)
- pnpm 9+ (https://pnpm.io)
- Git (https://git-scm.com)

## Instalação

### 1. Clonar Repositório

```bash
git clone https://github.com/seu-usuario/sapl-voto-web.git
cd sapl-voto-web
```

### 2. Instalar Dependências

```bash
pnpm install
```

### 3. Configurar Variáveis de Ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```
VITE_API_URL=http://localhost:3000
```

### 4. Iniciar Servidor de Desenvolvimento

```bash
pnpm dev
```

O aplicativo estará disponível em `http://localhost:5173`

## Desenvolvimento

### Estrutura de Pastas

```
src/
├── pages/              # Páginas da aplicação
├── components/         # Componentes reutilizáveis
├── store/             # Estado global (Zustand)
├── services/          # Serviços de API
├── types/             # Tipos TypeScript
├── styles/            # Estilos CSS
├── App.tsx            # Componente raiz
└── main.tsx           # Entrada
```

### Adicionar Nova Página

1. Criar arquivo em `src/pages/NovaPage.tsx`
2. Importar `Layout` e componentes necessários
3. Adicionar rota em `src/App.tsx`

Exemplo:

```typescript
// src/pages/NovaPage.tsx
import React from 'react';
import { Layout } from '@/components/Layout';
import './NovaPage.css';

export const NovaPage: React.FC = () => {
  return (
    <Layout title="Minha Página">
      <div className="nova-page">
        <h2>Conteúdo aqui</h2>
      </div>
    </Layout>
  );
};
```

### Usar Store

```typescript
import { useAuthStore } from '@/store/authStore';
import { useVotacaoStore } from '@/store/votacaoStore';

const { user, logout } = useAuthStore();
const { sessaoAtiva, materias, fetchMaterias } = useVotacaoStore();
```

### Chamar API

```typescript
import { votacaoAPI } from '@/services/api';

const response = await votacaoAPI.getSessaoAtiva();
```

## Testes

### Type Check

```bash
pnpm type-check
```

### Lint

```bash
pnpm lint
```

## Build

### Produção

```bash
pnpm build
```

Arquivos gerados em `dist/`

### Preview

```bash
pnpm preview
```

## Troubleshooting

### Erro: "Cannot find module"

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Erro: "Port 5173 already in use"

```bash
# Encontrar processo
lsof -i :5173

# Matar processo
kill -9 <PID>
```

### Erro: "API connection refused"

1. Verificar se backend está rodando em `http://localhost:3000`
2. Confirmar `VITE_API_URL` está correto em `.env.local`
3. Verificar CORS no backend

### Erro: "TypeScript compilation failed"

```bash
pnpm type-check
```

## Boas Práticas

### Commits

```bash
git commit -m "feat: adicionar nova funcionalidade"
git commit -m "fix: corrigir bug em votacao"
git commit -m "docs: atualizar README"
```

### Branches

```bash
# Feature
git checkout -b feature/minha-feature

# Fix
git checkout -b fix/meu-bug

# Push
git push origin feature/minha-feature
```

## Recursos

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com)
- [Zustand](https://github.com/pmndrs/zustand)

## Próximos Passos

1. Explorar código
2. Fazer pequenas alterações
3. Testar no navegador
4. Contribuir com features ou fixes
