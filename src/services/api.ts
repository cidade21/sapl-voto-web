import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

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
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const votacaoAPI = {
  // Sessões
  getSessaoAtiva: () => api.get('/api/trpc/votacao.sessao.ativa'),
  getSessoes: () => api.get('/api/trpc/votacao.sessao.listar'),
  getSessao: (id: number) => api.get(`/api/trpc/votacao.sessao.obter?input=${JSON.stringify({ sessaoId: id })}`),
  criarSessao: (data: { dataInicio: Date; descricao?: string }) =>
    api.post('/api/trpc/votacao.sessao.criar', { input: data }),
  atualizarSessao: (id: number, data: any) =>
    api.patch(`/api/trpc/votacao.sessao.atualizar?input=${JSON.stringify({ sessaoId: id, ...data })}`, {}),

  // Matérias
  getMateria: (id: number) => api.get(`/api/trpc/votacao.materia.obter?input=${JSON.stringify({ materiaId: id })}`),
  getMateriasSessionao: (sessaoId: number) =>
    api.get(`/api/trpc/votacao.materia.listarSessao?input=${JSON.stringify({ sessaoId })}`),
  criarMateria: (data: any) => api.post('/api/trpc/votacao.materia.criar', { input: data }),
  atualizarMateria: (id: number, data: any) =>
    api.patch(`/api/trpc/votacao.materia.atualizar?input=${JSON.stringify({ materiaId: id, ...data })}`, {}),

  // Votos
  registrarVoto: (materiaId: number, voto: 'sim' | 'nao' | 'abstencao') =>
    api.post('/api/trpc/votacao.voto.registrar', { input: { materiaId, voto } }),
  getVotoParlamentar: (materiaId: number) =>
    api.get(`/api/trpc/votacao.voto.obterParlamentar?input=${JSON.stringify({ materiaId })}`),
  getPlacar: (materiaId: number) =>
    api.get(`/api/trpc/votacao.voto.placar?input=${JSON.stringify({ materiaId })}`),

  // Auth
  login: (email: string, password: string) => api.post('/api/trpc/auth.login', { input: { email, password } }),
  logout: () => api.post('/api/trpc/auth.logout'),
  getMe: () => api.get('/api/trpc/auth.me'),
};

export default api;
