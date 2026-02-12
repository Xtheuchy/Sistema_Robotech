import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Navbars y Footer
import NavbarGamer from "./componentes/Navbar/NavbarGamer.jsx";
import NavbarCompetidor from "./componentes/Navbar/NavbarCompetidor.jsx";
import NavbarClub from "./componentes/Navbar/NavbarClub.jsx";
import Footer from "./componentes/Navbar/Footer.jsx";

// Páginas principales
import Inicio from "./componentes/paginas/Inicio.jsx";
import Nosotros from "./componentes/paginas/Nosotros.jsx";
import Informacion from "./componentes/paginas/Informacion.jsx";
import Ranking from "./componentes/paginas/Ranking.jsx";

// Registro
import RegistroClub from "./componentes/registro/RegistroClub.jsx";
import RegistroCompetidor from "./componentes/registro/RegistroCompetidor.jsx";

// Login
import Login from "./componentes/login/Login.jsx";

// Perfil
import PerfilClub from "./componentes/perfil/PerfilClub.jsx";
import ClubCompetidor from "./componentes/perfil/ClubCompetidor.jsx";
import PerfilCompetidor from "./componentes/perfil/PerfilCompetidor.jsx";

// Torneos y Salas
import Torneos from "./componentes/torneo/Torneos.jsx";
import SalaTorneo from "./componentes/sala/SalaTorneo.jsx";

// Estilos
import "./index.css";

function App() {
  const [competidorActivo, setCompetidorActivo] = useState(null);
  const [clubActivo, setClubActivo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const competidor = JSON.parse(localStorage.getItem("UsuarioData"));
      const club = JSON.parse(localStorage.getItem("clubActivo"));
      if (competidor) setCompetidorActivo(competidor);
      if (club) setClubActivo(club);
    } catch (error) {
      console.error("Error al leer localStorage:", error);
      localStorage.removeItem("UsuarioData");
      localStorage.removeItem("clubActivo");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const uData = JSON.parse(localStorage.getItem("UsuarioData"));
        const cData = JSON.parse(localStorage.getItem("clubActivo"));
        setCompetidorActivo(uData);
        setClubActivo(cData);
      } catch (error) {
        console.error("Error al actualizar estado desde storage:", error);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        color: '#fff',
        fontSize: '1.2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
          <p>Cargando Robotech...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
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

        {/* Login */}
        <Route
          path="/login"
          element={<Login setCompetidorActivo={setCompetidorActivo} setClubActivo={setClubActivo} />}
        />

        {/* Perfil - Rutas protegidas */}
        <Route
          path="/perfil/club"
          element={
            clubActivo ? <PerfilClub key="owner" clubActivo={clubActivo} /> : <Navigate to="/login" replace />
          }
        />
        {/* Ruta para ver perfil de un club (solo lectura si no es dueño) */}
        <Route path="/club/:id" element={<PerfilClub />} />
        <Route path="/club-competidor/:id" element={<ClubCompetidor />} />
        <Route
          path="/perfil/competidor"
          element={
            competidorActivo ? (
              <PerfilCompetidor key={competidorActivo.id} competidorActivo={competidorActivo} setCompetidorActivo={setCompetidorActivo} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Torneos */}
        <Route path="/torneos" element={<Torneos />} />

        {/* Sala de Torneo - Ruta dinámica por ID */}
        <Route path="/sala/:id" element={<SalaTorneo />} />

        {/* Cualquier otra ruta */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;

