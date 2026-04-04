import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Login } from '@/pages/Login';
import { ParlamentarHome } from '@/pages/ParlamentarHome';
import { MateriaDetail } from '@/pages/MateriaDetail';
import { OperadorHome } from '@/pages/OperadorHome';
import '@/styles/index.css';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Parlamentar Routes */}
        <Route
          path="/parlamentar"
          element={
            <ProtectedRoute requiredRole="parlamentar">
              <ParlamentarHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parlamentar/materia/:id"
          element={
            <ProtectedRoute requiredRole="parlamentar">
              <MateriaDetail />
            </ProtectedRoute>
          }
        />

        {/* Operador Routes */}
        <Route
          path="/operador"
          element={
            <ProtectedRoute requiredRole="operador">
              <OperadorHome />
            </ProtectedRoute>
          }
        />

        {/* Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
