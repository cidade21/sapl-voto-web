import axios, { AxiosError } from 'axios';

type ApiMutationPayload = Record<string, unknown>;

interface ApiErrorResponse {
  message?: string;
}

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

const rawApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const normalizedApiOrigin = rawApiUrl?.replace(/\/+$/, '').replace(/\/api$/, '');
const API_BASE_URL = normalizedApiOrigin ? `${normalizedApiOrigin}/api` : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const votacaoAPI = {
  // Sessões
  getSessaoAtiva: () => api.get('/trpc/votacao.sessao.ativa'),
  getSessoes: () => api.get('/trpc/votacao.sessao.listar'),
  getSessao: (id: number) => api.get(`/trpc/votacao.sessao.obter?input=${JSON.stringify({ sessaoId: id })}`),
  criarSessao: (data: { dataInicio: Date; descricao?: string }) =>
    api.post('/trpc/votacao.sessao.criar', { input: data }),
  atualizarSessao: (id: number, data: ApiMutationPayload) =>
    api.patch(`/trpc/votacao.sessao.atualizar?input=${JSON.stringify({ sessaoId: id, ...data })}`, {}),

  // Matérias
  getMateria: (id: number) => api.get(`/trpc/votacao.materia.obter?input=${JSON.stringify({ materiaId: id })}`),
  getMateriasSessionao: (sessaoId: number) =>
    api.get(`/trpc/votacao.materia.listarSessao?input=${JSON.stringify({ sessaoId })}`),
  criarMateria: (data: ApiMutationPayload) => api.post('/trpc/votacao.materia.criar', { input: data }),
  atualizarMateria: (id: number, data: ApiMutationPayload) =>
    api.patch(`/trpc/votacao.materia.atualizar?input=${JSON.stringify({ materiaId: id, ...data })}`, {}),

  // Votos
  registrarVoto: (materiaId: number, voto: 'sim' | 'nao' | 'abstencao') =>
    api.post('/trpc/votacao.voto.registrar', { input: { materiaId, voto } }),
  getVotoParlamentar: (materiaId: number) =>
    api.get(`/trpc/votacao.voto.obterParlamentar?input=${JSON.stringify({ materiaId })}`),
  getPlacar: (materiaId: number) =>
    api.get(`/trpc/votacao.voto.placar?input=${JSON.stringify({ materiaId })}`),

  // Auth
  login: (email: string, password: string) => api.post('/trpc/auth.login', { input: { email, password } }),
  logout: () => api.post('/trpc/auth.logout'),
  getMe: () => api.get('/trpc/auth.me'),
};

export default api;
