import { create } from 'zustand';
import { VotacaoState, Sessao, Materia, Placar, Voto } from '@/types';
import { votacaoAPI } from '@/services/api';

interface VotacaoStore extends VotacaoState {
  setSessaoAtiva: (sessao: Sessao | null) => void;
  setMaterias: (materias: Materia[]) => void;
  setPlacar: (materiaId: number, placar: Placar) => void;
  setMeuVoto: (materiaId: number, voto: Voto) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchSessaoAtiva: () => Promise<void>;
  fetchMaterias: (sessaoId: number) => Promise<void>;
  fetchPlacar: (materiaId: number) => Promise<void>;
  fetchMeuVoto: (materiaId: number) => Promise<void>;
  registrarVoto: (materiaId: number, voto: 'sim' | 'nao' | 'abstencao') => Promise<void>;
}

export const useVotacaoStore = create<VotacaoStore>((set, get) => ({
  sessaoAtiva: null,
  materias: [],
  placar: {},
  meuVoto: {},
  isLoading: false,
  error: null,

  setSessaoAtiva: (sessao) => set({ sessaoAtiva: sessao }),
  setMaterias: (materias) => set({ materias }),
  setPlacar: (materiaId, placar) =>
    set((state) => ({
      placar: { ...state.placar, [materiaId]: placar },
    })),
  setMeuVoto: (materiaId, voto) =>
    set((state) => ({
      meuVoto: { ...state.meuVoto, [materiaId]: voto },
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchSessaoAtiva: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await votacaoAPI.getSessaoAtiva();
      set({ sessaoAtiva: response.data.result, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchMaterias: async (sessaoId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await votacaoAPI.getMateriasSessionao(sessaoId);
      set({ materias: response.data.result, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchPlacar: async (materiaId) => {
    try {
      const response = await votacaoAPI.getPlacar(materiaId);
      set((state) => ({
        placar: { ...state.placar, [materiaId]: response.data.result },
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  fetchMeuVoto: async (materiaId) => {
    try {
      const response = await votacaoAPI.getVotoParlamentar(materiaId);
      if (response.data.result) {
        set((state) => ({
          meuVoto: { ...state.meuVoto, [materiaId]: response.data.result },
        }));
      }
    } catch (error) {
      // Silenciar erro se não há voto
    }
  },

  registrarVoto: async (materiaId, voto) => {
    set({ isLoading: true, error: null });
    try {
      await votacaoAPI.registrarVoto(materiaId, voto);
      // Atualizar placar e meu voto
      const state = get();
      await state.fetchPlacar(materiaId);
      await state.fetchMeuVoto(materiaId);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
