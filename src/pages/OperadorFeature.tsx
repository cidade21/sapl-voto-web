import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';

interface OperadorFeatureProps {
  title: string;
  description: string;
}

export const OperadorFeature: React.FC<OperadorFeatureProps> = ({ title, description }) => {
  const navigate = useNavigate();

  return (
    <Layout title={title}>
      <div className="operador-home">
        <section className="welcome-section">
          <h2>{title}</h2>
          <p>{description}</p>
        </section>

        <section className="info-section">
          <h3>Próximos passos</h3>
          <ul className="info-list">
            <li>Concluir a integração dessas telas com a API do SAPL.</li>
            <li>Validar permissões do operador em cada ação crítica.</li>
            <li>Publicar a funcionalidade no Render após revisar o fluxo completo.</li>
          </ul>
        </section>

        <section className="actions-section">
          <div className="action-card">
            <h3>Voltar ao painel</h3>
            <p>Retorne para a área principal do operador.</p>
            <button onClick={() => navigate('/operador')} className="btn btn-primary">
              Voltar
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};
