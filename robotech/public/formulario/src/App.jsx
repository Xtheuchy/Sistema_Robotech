import { useState, useEffect } from "react";
import FormularioMascota from "./components/FormularioMascota";
import ListaMascotas from "./components/ListaMascotas";

const App = () => {
  const [mascotas, setMascotas] = useState([]);
  const [mascotaAEditar, setMascotaAEditar] = useState(null);

  // Cargar mascotas desde localStorage al iniciar
  useEffect(() => {
    const datos = localStorage.getItem("mascotas");
    if (datos) setMascotas(JSON.parse(datos));
  }, []);

  // Guardar mascotas en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem("mascotas", JSON.stringify(mascotas));
  }, [mascotas]);

  const agregarMascota = (m) => setMascotas((prev) => [...prev, m]);

  const editarMascota = (mAct) => {
    setMascotas((prev) => prev.map((m) => (m.id === mAct.id ? mAct : m)));
    setMascotaAEditar(null);
  };

  const eliminarMascota = (id) => {
    setMascotas((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        boxSizing: "border-box",
        flexWrap: "wrap"
      }}
    >
      <div style={{ flex: 1, maxWidth: "400px" }}>
        <h1 style={{ marginBottom: "20px" }}>Gestión de Mascotas</h1>
        <FormularioMascota
          agregarMascota={agregarMascota}
          mascotaAEditar={mascotaAEditar}
          editarMascota={editarMascota}
        />
      </div>
      <div style={{ flex: 2, maxWidth: "700px" }}>
        <ListaMascotas
          mascotas={mascotas}
          setMascotaAEditar={setMascotaAEditar}
          eliminarMascota={eliminarMascota}
        />
      </div>
    </div>
  );
};

export default App;
