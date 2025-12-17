import MascotaItem from "./MascotaItem.jsx";

const ListaMascotas = ({ mascotas, setMascotaAEditar, eliminarMascota }) => {
  return (
    <div style={{ maxWidth: "700px" }}>
      {mascotas.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "#888" }}>
          No hay mascotas registradas
        </p>
      ) : (
        mascotas.map((m) => (
          <MascotaItem
            key={m.id}
            mascota={m}
            setMascotaAEditar={setMascotaAEditar}
            eliminarMascota={eliminarMascota}
          />
        ))
      )}
    </div>
  );
};

export default ListaMascotas;
