import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Navbars y Footer
import NavbarGamer from "./componentes/navbar/NavbarGamer.jsx";
import NavbarCompetidor from "./componentes/navbar/NavbarCompetidor.jsx";
import NavbarClub from "./componentes/navbar/NavbarClub.jsx";
import Footer from "./componentes/navbar/Footer.jsx";

// Páginas principales
import Inicio from "./componentes/paginas/Inicio.jsx";
import Nosotros from "./componentes/paginas/Nosotros.jsx";
import Informacion from "./componentes/paginas/Informacion.jsx";
import Ranking from "./componentes/paginas/Ranking.jsx";

// Registro
import RegistroClub from "./componentes/registro/RegistroClub.jsx";
import RegistroCompetidor from "./componentes/registro/RegistroCompetidor.jsx";
import RegistroRobot from "./componentes/registro/RegistroRobot.jsx";

// Login
import LoginClub from "./componentes/login/LoginClub.jsx";
import LoginCompetidor from "./componentes/login/LoginCompetidor.jsx";

// Perfil
import PerfilClub from "./componentes/perfil/PerfilClub.jsx";
import PerfilCompetidor from "./componentes/perfil/PerfilCompetidor.jsx";

// Torneos y Salas
import Torneos from "./componentes/torneo/Torneos.jsx";
import Sumo from "./componentes/sala/Sumo.jsx";
import SumoExtremo from "./componentes/sala/SumoExtremo.jsx";
import Laberintos from "./componentes/sala/Laberintos.jsx";
import RobotFutbol from "./componentes/sala/RobotFutbol.jsx";
import Drones from "./componentes/sala/Drones.jsx";
import BatallaIA from "./componentes/sala/BatallaIA.jsx";
import RoboRally from "./componentes/sala/RoboRally.jsx";
import Rescate from "./componentes/sala/Rescate.jsx";

// Estilos
import "./index.css";

function App() {
  const [competidorActivo, setCompetidorActivo] = useState(null);
  const [clubActivo, setClubActivo] = useState(null);
  
  // Escuchar cambios en otras pestañas
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        setCompetidorActivo(JSON.parse(localStorage.getItem("UsuarioData")));
        setClubActivo(JSON.parse(localStorage.getItem("clubActivo")));
      } catch (error) {
        console.error("Error al actualizar estado desde storage:", error);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      {/* Navbar dinámico según el usuario logueado */}
      {clubActivo ? (
        <NavbarClub setClubActivo={setClubActivo} />
      ) : competidorActivo ? (
        <NavbarCompetidor setCompetidorActivo={setCompetidorActivo} />
      ) : (
        <NavbarGamer />
      )}

      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/informacion" element={<Informacion />} />
        <Route path="/ranking" element={<Ranking />} />

        {/* Registro */}
        <Route path="/registro/club" element={<RegistroClub />} />
        <Route path="/registro/competidor" element={<RegistroCompetidor />} />
        <Route
          path="/registro/robot"
          element={
            competidorActivo ? (
              <RegistroRobot />
            ) : (
              <Navigate to="/login/competidor" replace />
            )
          }
        />

        {/* Login */}
        <Route
          path="/login/club"
          element={<LoginClub setClubActivo={setClubActivo} />}
        />
        <Route
          path="/login/competidor"
          element={<LoginCompetidor setCompetidorActivo={setCompetidorActivo} />}
        />

        {/* Perfil - Rutas protegidas */}
        <Route
          path="/perfil/club"
          element={
            clubActivo ? <PerfilClub key={clubActivo.id} clubActivo={clubActivo} /> : <Navigate to="/login/club" replace />
          }
        />
        <Route
          path="/perfil/competidor"
          element={
            competidorActivo ? (
              <PerfilCompetidor key={competidorActivo.id} competidorActivo={competidorActivo} setCompetidorActivo={setCompetidorActivo} />
            ) : (
              <Navigate to="/login/competidor" replace />
            )
          }
        />

        {/* Torneos */}
        <Route path="/torneos" element={<Torneos />} />

        {/* Rutas de Salas Específicas */}
        <Route path="/sala/sumo-1" element={<Sumo />} />
        <Route path="/sala/sumo-extremo" element={<SumoExtremo />} />
        <Route path="/sala/laberintos" element={<Laberintos />} />
        <Route path="/sala/futbol" element={<RobotFutbol />} />
        <Route path="/sala/drones" element={<Drones />} />
        <Route path="/sala/batalla-ia" element={<BatallaIA />} />
        <Route path="/sala/robo-rally" element={<RoboRally />} />
        <Route path="/sala/rescate" element={<Rescate />} />

        {/* Cualquier otra ruta */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
