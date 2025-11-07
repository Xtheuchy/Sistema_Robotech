import React from 'react';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

const ROLES_PERMITIDOS = ['ADMINISTRADOR', 'JUEZ'];

const RutaProtegida = ({ children }) => {
  const { usuario, logout } = useAuth(); 
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  const rolUsuario = usuario.rol.toUpperCase();
  const tienePermiso = ROLES_PERMITIDOS.includes(rolUsuario);

  if (tienePermiso) {
    return children;
    
  } else {
    logout(); 
    return <Navigate to="/login" replace />;
  }
};
export default RutaProtegida;