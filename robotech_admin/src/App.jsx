import './App.css'
import RutaProtegida from './RutaProtegida';
import AppPrivada from './AppPrivada';
import LoginPage from './pages/LoginPage';
import RutaPublica from './RutaPublica';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Routes>
      {/* rutas de acceso publico */}
      <Route
        path="/login"
        element={
          // bloquea el acceso si el usuario ya tiene sesion activa
          <RutaPublica>
            <LoginPage />
          </RutaPublica>
        }
      />

      {/* rutas protegidas de la aplicacion */}
      <Route
        path="/*"
        element={
          // verifica credenciales antes de mostrar el contenido privado
          <RutaProtegida>
            <AppPrivada />
          </RutaProtegida>
        }
      />
    </Routes>
  );
}
export default App;