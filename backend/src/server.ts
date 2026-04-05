import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import {
  createMateria,
  createSessao,
  findUserByEmail,
  getMateriaById,
  getPlacar,
  getSessaoAtiva,
  getSessaoById,
  getVotoParlamentar,
  listMateriasBySessao,
  listSessoes,
  registrarVoto,
  sanitizeUser,
  updateMateria,
  updateSessao,
} from './store.js';
import { createToken, verifyToken } from './auth.js';
import { MateriaRecord, PublicUser, SessaoRecord, UserRole, VotoTipo } from './types.js';

const app = express();
const port = Number(process.env.PORT || 3000);
const allowedOrigin = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: allowedOrigin === '*' ? true : allowedOrigin, credentials: true }));
app.use(express.json());

type Handler = (req: Request, res: Response) => Promise<void> | void;

interface AuthedRequest extends Request {
  user?: PublicUser;
}

const asyncHandler = (handler: Handler) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(handler(req, res)).catch(next);

const parseInput = <T>(req: Request): T => {
  if (typeof req.query.input === 'string') {
    return JSON.parse(req.query.input) as T;
  }

  const body = req.body as { input?: T } | undefined;
  return (body?.input || {}) as T;
};

const ok = (res: Response, result: unknown) => {
  res.json({ result });
};

const fail = (res: Response, status: number, message: string) => {
  res.status(status).json({ message });
};

const requireAuth = (req: AuthedRequest, res: Response, next: NextFunction) => {
  const header = req.header('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  const user = token ? verifyToken(token) : null;

  if (!user) {
    fail(res, 401, 'Nao autenticado');
    return;
  }

  req.user = user;
  next();
};

const requireRole = (roles: UserRole[]) => (req: AuthedRequest, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    fail(res, 403, 'Sem permissao para executar esta acao');
    return;
  }

  next();
};

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/trpc/auth.login', asyncHandler((req, res) => {
  const input = parseInput<{ email?: string; password?: string }>(req);

  if (!input.email || !input.password) {
    fail(res, 400, 'Email e senha sao obrigatorios');
    return;
  }

  const user = findUserByEmail(input.email);
  if (!user || user.password !== input.password) {
    fail(res, 401, 'Credenciais invalidas');
    return;
  }

  ok(res, {
    user: sanitizeUser(user),
    token: createToken(user),
  });
}));

app.post('/api/trpc/auth.logout', (_req, res) => {
  ok(res, { success: true });
});

app.get('/api/trpc/auth.me', requireAuth, (req: AuthedRequest, res) => {
  ok(res, req.user);
});

app.get('/api/trpc/votacao.sessao.ativa', requireAuth, (_req, res) => {
  ok(res, getSessaoAtiva());
});

app.get('/api/trpc/votacao.sessao.listar', requireAuth, (_req, res) => {
  ok(res, listSessoes());
});

app.get('/api/trpc/votacao.sessao.obter', requireAuth, (req, res) => {
  const input = parseInput<{ sessaoId: number }>(req);
  const sessao = getSessaoById(input.sessaoId);
  if (!sessao) {
    fail(res, 404, 'Sessao nao encontrada');
    return;
  }

  ok(res, sessao);
});

app.post('/api/trpc/votacao.sessao.criar', requireAuth, requireRole(['operador', 'admin']), (req: AuthedRequest, res) => {
  const input = parseInput<{ dataInicio?: string; descricao?: string }>(req);
  ok(res, createSessao(input, req.user!.id));
});

app.patch('/api/trpc/votacao.sessao.atualizar', requireAuth, requireRole(['operador', 'admin']), (req, res) => {
  const input = parseInput<{ sessaoId: number } & Partial<SessaoRecord>>(req);
  const sessao = updateSessao(input.sessaoId, input);
  if (!sessao) {
    fail(res, 404, 'Sessao nao encontrada');
    return;
  }

  ok(res, sessao);
});

app.get('/api/trpc/votacao.materia.listarSessao', requireAuth, (req, res) => {
  const input = parseInput<{ sessaoId: number }>(req);
  ok(res, listMateriasBySessao(input.sessaoId));
});

app.get('/api/trpc/votacao.materia.obter', requireAuth, (req, res) => {
  const input = parseInput<{ materiaId: number }>(req);
  const materia = getMateriaById(input.materiaId);
  if (!materia) {
    fail(res, 404, 'Materia nao encontrada');
    return;
  }

  ok(res, materia);
});

app.post('/api/trpc/votacao.materia.criar', requireAuth, requireRole(['operador', 'admin']), (req, res) => {
  const input = parseInput<Omit<MateriaRecord, 'id' | 'createdAt'>>(req);
  ok(res, createMateria(input));
});

app.patch('/api/trpc/votacao.materia.atualizar', requireAuth, requireRole(['operador', 'admin']), (req, res) => {
  const input = parseInput<{ materiaId: number } & Partial<MateriaRecord>>(req);
  const materia = updateMateria(input.materiaId, input);
  if (!materia) {
    fail(res, 404, 'Materia nao encontrada');
    return;
  }

  ok(res, materia);
});

app.post('/api/trpc/votacao.voto.registrar', requireAuth, requireRole(['parlamentar', 'admin']), (req: AuthedRequest, res) => {
  const input = parseInput<{ materiaId: number; voto: VotoTipo }>(req);
  const materia = getMateriaById(input.materiaId);
  if (!materia) {
    fail(res, 404, 'Materia nao encontrada');
    return;
  }

  ok(res, registrarVoto(input.materiaId, req.user!.id, input.voto));
});

app.get('/api/trpc/votacao.voto.obterParlamentar', requireAuth, requireRole(['parlamentar', 'admin']), (req: AuthedRequest, res) => {
  const input = parseInput<{ materiaId: number }>(req);
  ok(res, getVotoParlamentar(input.materiaId, req.user!.id));
});

app.get('/api/trpc/votacao.voto.placar', requireAuth, (req, res) => {
  const input = parseInput<{ materiaId: number }>(req);
  ok(res, getPlacar(input.materiaId));
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = error instanceof Error ? error.message : 'Erro interno do servidor';
  fail(res, 500, message);
});

app.listen(port, () => {
  console.log(`sapl-voto-api listening on port ${port}`);
});
