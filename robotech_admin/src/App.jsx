import './App.css'
import RutaProtegida from './RutaProtegida';
import AppPrivada from './AppPrivada';
import LoginPage from './pages/LoginPage';
import RutaPublica from './RutaPublica';

import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Routes>
      {/* --- RUTAS PÚBLICAS --- */}
      {/* (Protegidas por RutaPublica para que un usuario 
           logueado no vea el login) */}

      <Route
        path="/login"
        element={
          <RutaPublica>
            <LoginPage/> 
          </RutaPublica>
        }
      />
      
      {/* --- RUTAS PRIVADAS --- */}
      {/* protegido por RutaProtegida -> solo se muestra para usuarios que iniciaron sesión */}
      <Route
        path="/*"
        element={
          <RutaProtegida>
            <AppPrivada />
          </RutaProtegida>
        }
      />
    </Routes>
  );
}

export default App;