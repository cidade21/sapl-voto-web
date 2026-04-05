export type UserRole = 'parlamentar' | 'operador' | 'admin';
export type SessaoStatus = 'planejada' | 'ativa' | 'encerrada';
export type MateriaStatus = 'nao_votada' | 'em_votacao' | 'votada';
export type VotoTipo = 'sim' | 'nao' | 'abstencao';

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface SessaoRecord {
  id: number;
  dataInicio: string;
  dataTermino?: string;
  status: SessaoStatus;
  descricao?: string;
  operadorId: number;
  createdAt: string;
}

export interface MateriaRecord {
  id: number;
  numero: string;
  titulo: string;
  ementa?: string;
  autor?: string;
  sessaoId: number;
  status: MateriaStatus;
  createdAt: string;
}

export interface VotoRecord {
  id: number;
  materiaId: number;
  parlamentarId: number;
  voto: VotoTipo;
  dataVoto: string;
}

export interface EmailEnviadoRecord {
  id: number;
  sessaoId: number;
  destinatario: string;
  tipo: 'inicio' | 'termino' | 'resultado';
  status: 'pendente' | 'enviado' | 'erro';
  createdAt: string;
}

export interface Database {
  users: UserRecord[];
  sessoes: SessaoRecord[];
  materias: MateriaRecord[];
  votos: VotoRecord[];
  emails: EmailEnviadoRecord[];
  counters: {
    users: number;
    sessoes: number;
    materias: number;
    votos: number;
    emails: number;
  };
}
