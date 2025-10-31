import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaPublica = ({ isAuth, children }) => {

  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RutaPublica;