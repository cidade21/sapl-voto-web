import fs from 'node:fs';
import path from 'node:path';
import { Database, MateriaRecord, SessaoRecord, UserRecord, VotoRecord, VotoTipo } from './types.js';
import { createSeedDatabase } from './seed.js';

const dataFile = process.env.DATA_FILE || path.resolve(process.cwd(), 'data', 'store.json');

const ensureDirectory = () => {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
};

const writeDatabase = (database: Database) => {
  ensureDirectory();
  fs.writeFileSync(dataFile, JSON.stringify(database, null, 2));
};

const loadDatabase = (): Database => {
  ensureDirectory();

  if (!fs.existsSync(dataFile)) {
    const seed = createSeedDatabase();
    writeDatabase(seed);
    return seed;
  }

  const raw = fs.readFileSync(dataFile, 'utf-8');
  return JSON.parse(raw) as Database;
};

let database = loadDatabase();

export const getDatabase = () => database;

export const saveDatabase = () => {
  writeDatabase(database);
};

export const sanitizeUser = (user: UserRecord) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

export const findUserByEmail = (email: string) =>
  database.users.find((user) => user.email.toLowerCase() === email.toLowerCase());

export const findUserById = (id: number) =>
  database.users.find((user) => user.id === id);

export const getSessaoAtiva = (): SessaoRecord | null =>
  database.sessoes.find((sessao) => sessao.status === 'ativa') || null;

export const getSessaoById = (sessaoId: number) =>
  database.sessoes.find((sessao) => sessao.id === sessaoId) || null;

export const listSessoes = () =>
  [...database.sessoes].sort((a, b) => b.id - a.id);

export const createSessao = (input: { dataInicio?: string; descricao?: string }, operadorId: number) => {
  const sessao: SessaoRecord = {
    id: ++database.counters.sessoes,
    dataInicio: input.dataInicio || new Date().toISOString(),
    descricao: input.descricao,
    status: 'planejada',
    operadorId,
    createdAt: new Date().toISOString(),
  };

  database.sessoes.push(sessao);
  saveDatabase();
  return sessao;
};

export const updateSessao = (sessaoId: number, patch: Partial<SessaoRecord>) => {
  const sessao = getSessaoById(sessaoId);
  if (!sessao) {
    return null;
  }

  Object.assign(sessao, patch);
  saveDatabase();
  return sessao;
};

export const listMateriasBySessao = (sessaoId: number) =>
  database.materias.filter((materia) => materia.sessaoId === sessaoId);

export const getMateriaById = (materiaId: number) =>
  database.materias.find((materia) => materia.id === materiaId) || null;

export const createMateria = (input: Omit<MateriaRecord, 'id' | 'createdAt'>) => {
  const materia: MateriaRecord = {
    ...input,
    id: ++database.counters.materias,
    createdAt: new Date().toISOString(),
  };

  database.materias.push(materia);
  saveDatabase();
  return materia;
};

export const updateMateria = (materiaId: number, patch: Partial<MateriaRecord>) => {
  const materia = getMateriaById(materiaId);
  if (!materia) {
    return null;
  }

  Object.assign(materia, patch);
  saveDatabase();
  return materia;
};

export const getPlacar = (materiaId: number) => {
  const votos = database.votos.filter((voto) => voto.materiaId === materiaId);
  return {
    materiaId,
    sim: votos.filter((voto) => voto.voto === 'sim').length,
    nao: votos.filter((voto) => voto.voto === 'nao').length,
    abstencao: votos.filter((voto) => voto.voto === 'abstencao').length,
    total: votos.length,
  };
};

export const getVotoParlamentar = (materiaId: number, parlamentarId: number) =>
  database.votos.find((voto) => voto.materiaId === materiaId && voto.parlamentarId === parlamentarId) || null;

export const registrarVoto = (materiaId: number, parlamentarId: number, voto: VotoTipo) => {
  let registro = getVotoParlamentar(materiaId, parlamentarId);

  if (registro) {
    registro.voto = voto;
    registro.dataVoto = new Date().toISOString();
  } else {
    registro = {
      id: ++database.counters.votos,
      materiaId,
      parlamentarId,
      voto,
      dataVoto: new Date().toISOString(),
    } as VotoRecord;
    database.votos.push(registro);
  }

  const materia = getMateriaById(materiaId);
  if (materia && materia.status === 'nao_votada') {
    materia.status = 'em_votacao';
  }

  saveDatabase();
  return registro;
};
