import { Database } from './types.js';

const now = new Date().toISOString();

export const createSeedDatabase = (): Database => ({
  users: [
    {
      id: 1,
      name: 'Operador SAPL',
      email: process.env.SEED_OPERATOR_EMAIL || 'operador@cidade21.local',
      password: process.env.SEED_OPERATOR_PASSWORD || '123456',
      role: 'operador',
      createdAt: now,
    },
    {
      id: 2,
      name: 'Vereador Demo',
      email: process.env.SEED_PARLAMENTAR_EMAIL || 'parlamentar@cidade21.local',
      password: process.env.SEED_PARLAMENTAR_PASSWORD || '123456',
      role: 'parlamentar',
      createdAt: now,
    },
  ],
  sessoes: [
    {
      id: 1,
      dataInicio: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      status: 'ativa',
      descricao: 'Sessao demonstrativa do SAPL Votacao',
      operadorId: 1,
      createdAt: now,
    },
  ],
  materias: [
    {
      id: 1,
      numero: 'PL 001/2026',
      titulo: 'Abertura de credito suplementar',
      ementa: 'Autoriza abertura de credito suplementar para manutencao de servicos essenciais.',
      autor: 'Mesa Diretora',
      sessaoId: 1,
      status: 'em_votacao',
      createdAt: now,
    },
    {
      id: 2,
      numero: 'REQ 014/2026',
      titulo: 'Requerimento de informacoes sobre iluminacao publica',
      ementa: 'Solicita informacoes sobre manutencao da rede de iluminacao publica.',
      autor: 'Comissao de Obras',
      sessaoId: 1,
      status: 'nao_votada',
      createdAt: now,
    },
  ],
  votos: [],
  emails: [],
  counters: {
    users: 2,
    sessoes: 1,
    materias: 2,
    votos: 0,
    emails: 0,
  },
});
