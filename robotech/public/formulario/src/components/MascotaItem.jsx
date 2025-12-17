import Swal from "sweetalert2";

const MascotaItem = ({ mascota, setMascotaAEditar, eliminarMascota }) => {
  const handleEliminar = () => {
    Swal.fire({
      title: '¿Eliminar mascota?',
      text: `${mascota.nombre} será eliminada`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) eliminarMascota(mascota.id);
    });
  };

  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "12px 16px",
        marginBottom: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <div>
        <span style={{ fontWeight: "700" }}>{mascota.nombre}</span>{" "}
        <span>({mascota.tipo})</span>
        <div style={{ fontSize: "0.9rem", color: "#555", marginTop: "4px" }}>
          Edad: {mascota.edad} años • Color: {mascota.color}
        </div>
        <div style={{ marginTop: "6px", fontStyle: "italic", color: "#666" }}>
          {mascota.observaciones}
        </div>
        {mascota.vacunado && (
          <span
            style={{
              display: "inline-block",
              marginTop: "6px",
              padding: "2px 8px",
              backgroundColor: "#28a745",
              color: "#fff",
              borderRadius: "12px",
              fontSize: "0.8rem",
              fontWeight: "600"
            }}
          >
            Vacunado
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={() => setMascotaAEditar(mascota)}
          style={{
            backgroundColor: "#ffc107",
            border: "none",
            borderRadius: "4px",
            padding: "6px 12px",
            cursor: "pointer",
            fontWeight: "600",
            color: "#212529"
          }}
        >
          Editar
        </button>
        <button
          onClick={handleEliminar}
          style={{
            backgroundColor: "#dc3545",
            border: "none",
            borderRadius: "4px",
            padding: "6px 12px",
            cursor: "pointer",
            fontWeight: "600",
            color: "white"
          }}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default MascotaItem;
