import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout'; 

import Inicio from './pages/Inicio'; 
import Usuarios from './pages/Usuarios';
import Torneos from './pages/Torneos';
import NotFoundPage from './pages/NotFoundPage';
import DetalleTorneo from './pages/DetalleTorneo';
import TorneoBracket from './pages/TorneoBracket';
import Clubes from './pages/Clubes';
import Organizacion from './pages/Organizacion';


const AppPrivada = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path='/usuarios' element={<Usuarios/>}/>
        <Route path='/torneos' element={<Torneos/>}/>
        <Route path='/DetalleTorneo/:id' element={<DetalleTorneo/>}/>
        <Route path='/TorneoBracket/:torneoId' element={<TorneoBracket/>}/>
        <Route path='/clubes' element={<Clubes/>}/>
        <Route path='/organizacion' element={<Organizacion/>}/>
        {/* ...todas las demás rutas de tu panel... */}
        {/* Un 404 para rutas DENTRO del panel que no existan */}

        <Route path="*" element={<NotFoundPage />} /> 
      </Routes>
    </Layout>
  );
}
export default AppPrivada;