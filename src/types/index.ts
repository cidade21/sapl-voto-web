export interface User {
  id: number;
  name: string;
  email: string;
  role: 'parlamentar' | 'operador' | 'admin';
  createdAt: Date;
}

export interface Sessao {
  id: number;
  dataInicio: Date;
  dataTermino?: Date;
  status: 'planejada' | 'ativa' | 'encerrada';
  descricao?: string;
  operadorId: number;
  createdAt: Date;
}

export interface Materia {
  id: number;
  numero: string;
  titulo: string;
  ementa?: string;
  autor?: string;
  sessaoId: number;
  status: 'nao_votada' | 'em_votacao' | 'votada';
  createdAt: Date;
}

export interface Voto {
  id: number;
  materiaId: number;
  parlamentarId: number;
  voto: 'sim' | 'nao' | 'abstencao';
  dataVoto: Date;
}

export interface Placar {
  materiaId: number;
  sim: number;
  nao: number;
  abstencao: number;
  total: number;
}

export interface EmailEnviado {
  id: number;
  sessaoId: number;
  destinatario: string;
  tipo: 'inicio' | 'termino' | 'resultado';
  status: 'pendente' | 'enviado' | 'erro';
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface VotacaoState {
  sessaoAtiva: Sessao | null;
  materias: Materia[];
  placar: Record<number, Placar>;
  meuVoto: Record<number, Voto>;
  isLoading: boolean;
  error: string | null;
}
