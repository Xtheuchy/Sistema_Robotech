import { useState } from 'react';
import './App.css'
import RutaProtegida from './RutaProtegida';
import AppPrivada from './AppPrivada';
import LoginPage from './pages/LoginPage';
import RutaPublica from './RutaPublica';

import { Routes, Route } from 'react-router-dom';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  return (
    <Routes>
      {/* --- RUTAS PÚBLICAS --- */}
      {/* Estas se pueden ver sin iniciar sesión */}
      <Route
        path="/login"
        element={
          <RutaPublica isAuth={isLoggedIn}>
            <LoginPage onLoginSuccess={handleLogin} />
          </RutaPublica>
        }
      />
      {/* --- RUTAS PRIVADAS --- */}
      {/* path="/*" significa "atrapa todo lo demás" */}
      <Route
        path="/*"
        element={
          <RutaProtegida isAuth={isLoggedIn}>
            <AppPrivada />
          </RutaProtegida>
        }
      />
    </Routes>
  )
}

export default App
