import React from 'react';
import { useAuth } from './context/AuthContext'; // <-- 1. Importa el hook
import { Navigate } from 'react-router-dom';

// Ya no recibe 'isAuth' como prop
const RutaPublica = ({ children }) => {
  
  const { usuario } = useAuth(); // 2. Lee el usuario desde el contexto

  if (usuario) {
    // 3. Si SÍ hay usuario, redirige al panel (path="/*")
    return <Navigate to="/" replace />; // (Asumiendo que "/" es tu ruta privada principal)
  }

  // 4. Si NO hay usuario, muestra los hijos (<LoginPage />)
  return children; 
};
export default RutaPublica;