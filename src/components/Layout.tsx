import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <div className="header-brand">
            <h1>SAPL Votação</h1>
            <span className="header-subtitle">Coité</span>
          </div>
          
          {title && <h2 className="header-title">{title}</h2>}
          
          <div className="header-user">
            {user && (
              <>
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role === 'parlamentar' ? 'Parlamentar' : 'Operador'}</span>
              </>
            )}
            <button onClick={handleLogout} className="btn-logout">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2026 Câmara de Conceição do Coité. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};
