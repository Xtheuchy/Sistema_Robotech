import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout'; // Tu Layout con AsideBar y Header
// Importa TODAS las páginas de tu panel
import Inicio from './pages/Inicio'; // O Dashboard
import Sobre from './pages/Sobre';
import NotFoundPage from './pages/NotFoundPage'; // El 404 de tu panel

// Este componente SÓLO se mostrará si el usuario está autenticado
const AppPrivada = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/sobre" element={<Sobre />} />
        {/* ...todas las demás rutas de tu panel... */}
        {/* Un 404 para rutas DENTRO del panel que no existan */}
        <Route path="*" element={<NotFoundPage />} /> 
      </Routes>
    </Layout>
  );
}
export default AppPrivada;