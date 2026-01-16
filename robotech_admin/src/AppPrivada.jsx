import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import VerificarRol from './components/VerificarRol';

import Inicio from './pages/Inicio';
import Usuarios from './pages/Usuarios';
import Torneos from './pages/Torneos';
import NotFoundPage from './pages/NotFoundPage';
import DetalleTorneo from './pages/DetalleTorneo';
import TorneoBracket from './pages/TorneoBracket';
import Clubes from './pages/Clubes';
import Organizacion from './pages/Organizacion';
import DetalleClub from './pages/DetalleClub';


const AppPrivada = () => {
  return (
    <Layout>
      <Routes>
        {/* Rutas accesibles para todos los usuarios autenticados */}
        <Route path="/" element={<Inicio />} />
        <Route path='/torneos' element={<Torneos />} />
        <Route path='/DetalleTorneo/:id' element={<DetalleTorneo />} />
        <Route path='/TorneoBracket/:torneoId' element={<TorneoBracket />} />

        {/* Rutas solo para Administrador */}
        <Route path='/usuarios' element={<VerificarRol elemento={<Usuarios />} rolesPermitidos={['Administrador']} />} />
        <Route path='/clubes' element={<VerificarRol elemento={<Clubes />} rolesPermitidos={['Administrador']} />} />
        <Route path='/organizacion' element={<VerificarRol elemento={<Organizacion />} rolesPermitidos={['Administrador']} />} />
        <Route path='/DetalleClub/:clubId' element={<VerificarRol elemento={<DetalleClub />} rolesPermitidos={['Administrador']} />} />

        {/* 404 para rutas que no existan */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
export default AppPrivada;