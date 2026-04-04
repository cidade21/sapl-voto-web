import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVotacaoStore } from '@/store/votacaoStore';
import { Layout } from '@/components/Layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './MateriaDetail.css';

export const MateriaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedVoto, setSelectedVoto] = useState<'sim' | 'nao' | 'abstencao' | null>(null);
  const { materias, placar, meuVoto, isLoading, registrarVoto, fetchPlacar, fetchMeuVoto } = useVotacaoStore();

  const materiaId = id ? parseInt(id) : 0;
  const materia = materias.find((m) => m.id === materiaId);
  const placarData = placar[materiaId];
  const meuVotoData = meuVoto[materiaId];

  useEffect(() => {
    if (materiaId) {
      fetchPlacar(materiaId);
      fetchMeuVoto(materiaId);
      
      // Atualizar placar a cada 2 segundos
      const interval = setInterval(() => {
        fetchPlacar(materiaId);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [materiaId, fetchPlacar, fetchMeuVoto]);

  const handleVoto = async (voto: 'sim' | 'nao' | 'abstencao') => {
    try {
      setSelectedVoto(voto);
      await registrarVoto(materiaId, voto);
    } catch (error) {
      setSelectedVoto(null);
    }
  };

  if (!materia) {
    return (
      <Layout title="Matéria não encontrada">
        <div className="error-container">
          <p>Matéria não encontrada</p>
          <button onClick={() => navigate('/parlamentar')} className="btn btn-primary">
            Voltar
          </button>
        </div>
      </Layout>
    );
  }

  const chartData = placarData
    ? [
        { name: 'Sim', value: placarData.sim },
        { name: 'Não', value: placarData.nao },
        { name: 'Abstenção', value: placarData.abstencao },
      ]
    : [];

  return (
    <Layout title={`Matéria ${materia.numero}`}>
      <div className="materia-detail">
        <button onClick={() => navigate('/parlamentar')} className="btn-back">
          ← Voltar
        </button>

        {/* Informações da Matéria */}
        <section className="materia-info">
          <div className="info-header">
            <div>
              <h1>{materia.titulo}</h1>
              <p className="info-numero">Número: {materia.numero}</p>
            </div>
            <span className={`status-badge status-${materia.status}`}>
              {materia.status === 'em_votacao'
                ? 'Em votação'
                : materia.status === 'votada'
                ? 'Votada'
                : 'Não votada'}
            </span>
          </div>

          {materia.ementa && (
            <div className="info-section">
              <h3>Ementa</h3>
              <p>{materia.ementa}</p>
            </div>
          )}

          {materia.autor && (
            <div className="info-section">
              <h3>Autor</h3>
              <p>{materia.autor}</p>
            </div>
          )}
        </section>

        {/* Placar */}
        {placarData && (
          <section className="placar-section">
            <h2>Placar Atual</h2>

            <div className="placar-grid">
              <div className="placar-item sim">
                <span className="placar-label">SIM</span>
                <span className="placar-valor">{placarData.sim}</span>
              </div>
              <div className="placar-item nao">
                <span className="placar-label">NÃO</span>
                <span className="placar-valor">{placarData.nao}</span>
              </div>
              <div className="placar-item abstencao">
                <span className="placar-label">ABSTENÇÃO</span>
                <span className="placar-valor">{placarData.abstencao}</span>
              </div>
            </div>

            {chartData.length > 0 && (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0a7ea4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>
        )}

        {/* Seu Voto */}
        <section className="voto-section">
          <h2>Seu Voto</h2>

          {meuVotoData ? (
            <div className="voto-registrado">
              <p className="voto-label">Você votou em:</p>
              <p className="voto-valor">
                {meuVotoData.voto === 'sim'
                  ? 'SIM'
                  : meuVotoData.voto === 'nao'
                  ? 'NÃO'
                  : 'ABSTENÇÃO'}
              </p>
              <p className="voto-data">
                {new Date(meuVotoData.dataVoto).toLocaleString('pt-BR')}
              </p>
            </div>
          ) : materia.status === 'em_votacao' ? (
            <div className="voto-opcoes">
              <p className="voto-label">Registre seu voto:</p>
              <div className="voto-buttons">
                <button
                  onClick={() => handleVoto('sim')}
                  disabled={isLoading}
                  className={`btn-voto sim ${selectedVoto === 'sim' ? 'selected' : ''}`}
                >
                  SIM
                </button>
                <button
                  onClick={() => handleVoto('nao')}
                  disabled={isLoading}
                  className={`btn-voto nao ${selectedVoto === 'nao' ? 'selected' : ''}`}
                >
                  NÃO
                </button>
                <button
                  onClick={() => handleVoto('abstencao')}
                  disabled={isLoading}
                  className={`btn-voto abstencao ${selectedVoto === 'abstencao' ? 'selected' : ''}`}
                >
                  ABSTENÇÃO
                </button>
              </div>
            </div>
          ) : (
            <div className="voto-encerrada">
              <p>Votação encerrada para esta matéria</p>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};
