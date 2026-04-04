import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useVotacaoStore } from '@/store/votacaoStore';
import { Layout } from '@/components/Layout';
import './ParlamentarHome.css';

export const ParlamentarHome: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { sessaoAtiva, materias, isLoading, error, fetchSessaoAtiva, fetchMaterias } = useVotacaoStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchSessaoAtiva();
  }, [isAuthenticated, navigate, fetchSessaoAtiva]);

  useEffect(() => {
    if (sessaoAtiva?.id) {
      fetchMaterias(sessaoAtiva.id);
    }
  }, [sessaoAtiva?.id, fetchMaterias]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout title="Votação">
      <div className="parlamentar-home">
        {/* Status da Sessão */}
        <section className="session-status">
          {sessaoAtiva ? (
            <div className="status-card active">
              <h3>Sessão Ativa</h3>
              <p className="session-date">
                {new Date(sessaoAtiva.dataInicio).toLocaleString('pt-BR')}
              </p>
              {sessaoAtiva.descricao && (
                <p className="session-description">{sessaoAtiva.descricao}</p>
              )}
            </div>
          ) : (
            <div className="status-card inactive">
              <h3>Nenhuma Sessão Ativa</h3>
              <p>Aguardando início de uma sessão de votação</p>
            </div>
          )}
        </section>

        {/* Matérias em Votação */}
        <section className="materias-section">
          <h2>Matérias em Votação</h2>

          {isLoading && (
            <div className="loading">
              <p>Carregando matérias...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {!isLoading && materias.length === 0 && (
            <div className="empty-state">
              <p>Nenhuma matéria disponível para votação no momento</p>
            </div>
          )}

          {!isLoading && materias.length > 0 && (
            <div className="materias-grid">
              {materias.map((materia) => (
                <div
                  key={materia.id}
                  className={`materia-card status-${materia.status}`}
                  onClick={() => navigate(`/parlamentar/materia/${materia.id}`)}
                >
                  <div className="materia-header">
                    <span className="materia-numero">{materia.numero}</span>
                    <span className={`status-badge status-${materia.status}`}>
                      {materia.status === 'em_votacao'
                        ? 'Em votação'
                        : materia.status === 'votada'
                        ? 'Votada'
                        : 'Não votada'}
                    </span>
                  </div>

                  <h3 className="materia-titulo">{materia.titulo}</h3>

                  {materia.ementa && (
                    <p className="materia-ementa">{materia.ementa}</p>
                  )}

                  {materia.autor && (
                    <p className="materia-autor">Autor: {materia.autor}</p>
                  )}

                  <button className="btn btn-primary btn-sm">
                    {materia.status === 'em_votacao' ? 'Votar' : 'Ver Resultado'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};
