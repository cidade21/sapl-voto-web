import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Layout } from '@/components/Layout';
import './OperadorHome.css';

export const OperadorHome: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'operador') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'operador') {
    return null;
  }

  return (
    <Layout title="Painel do Operador">
      <div className="operador-home">
        <section className="welcome-section">
          <h2>Bem-vindo, {user.name}!</h2>
          <p>Gerencie as sessões de votação e acompanhe os resultados em tempo real.</p>
        </section>

        <section className="actions-section">
          <div className="action-card">
            <h3>Nova Sessão</h3>
            <p>Criar uma nova sessão de votação</p>
            <button
              onClick={() => navigate('/operador/nova-sessao')}
              className="btn btn-primary"
            >
              Criar Sessão
            </button>
          </div>

          <div className="action-card">
            <h3>Minhas Sessões</h3>
            <p>Visualizar e gerenciar sessões existentes</p>
            <button
              onClick={() => navigate('/operador/sessoes')}
              className="btn btn-primary"
            >
              Ver Sessões
            </button>
          </div>

          <div className="action-card">
            <h3>Relatórios</h3>
            <p>Acompanhar resultados de votações</p>
            <button
              onClick={() => navigate('/operador/relatorios')}
              className="btn btn-primary"
            >
              Ver Relatórios
            </button>
          </div>
        </section>

        <section className="info-section">
          <h3>Informações Úteis</h3>
          <ul className="info-list">
            <li>
              <strong>Criar Sessão:</strong> Configure a data, hora e descrição da sessão
            </li>
            <li>
              <strong>Iniciar Votação:</strong> Ative a votação e notifique os vereadores por e-mail
            </li>
            <li>
              <strong>Monitorar Placar:</strong> Acompanhe os votos em tempo real
            </li>
            <li>
              <strong>Encerrar Votação:</strong> Finalize a votação e envie os resultados
            </li>
          </ul>
        </section>
      </div>
    </Layout>
  );
};
