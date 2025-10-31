import React from 'react';
import { useAuth } from './context/AuthContext'; // <-- 1. Importa el hook
import { Navigate } from 'react-router-dom';

// Ya no recibe 'isAuth' como prop
const ROLES_PERMITIDOS = ['ADMINISTRADOR', 'JUEZ'];
const RutaProtegida = ({ children }) => {
  const { usuario, logout } = useAuth(); 
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // 2. Esta lógica ya funciona perfecto
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