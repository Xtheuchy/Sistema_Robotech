import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout'; 

import Inicio from './pages/Inicio'; 
import NotFoundPage from './pages/NotFoundPage'; // El 404 de tu panel


const AppPrivada = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Inicio />} />
        {/* ...todas las demás rutas de tu panel... */}
        {/* Un 404 para rutas DENTRO del panel que no existan */}
        <Route path="*" element={<NotFoundPage />} /> 
      </Routes>
    </Layout>
  );
}
export default AppPrivada;