import React from 'react';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

const RutaPublica = ({ children }) => {
  
  const { usuario } = useAuth(); // Lee el usuario desde el contexto

  if (usuario) {
    return <Navigate to="/" replace />;
  }
  
  return children; 
};
export default RutaPublica;