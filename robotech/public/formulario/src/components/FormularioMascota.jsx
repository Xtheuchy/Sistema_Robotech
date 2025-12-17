import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const formularioInicial = {
  nombre: "",
  tipo: "",
  edad: "",
  color: "",
  observaciones: "",
  vacunado: false
};

const FormularioMascota = ({ agregarMascota, mascotaAEditar, editarMascota }) => {
  const [form, setForm] = useState(formularioInicial);

  useEffect(() => {
    if (mascotaAEditar) {
      setForm({
        nombre: mascotaAEditar.nombre,
        tipo: mascotaAEditar.tipo,
        edad: mascotaAEditar.edad ?? "",
        color: mascotaAEditar.color ?? "",
        observaciones: mascotaAEditar.observaciones ?? "",
        vacunado: mascotaAEditar.vacunado ?? false
      });
    } else {
      setForm(formularioInicial);
    }
  }, [mascotaAEditar]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, tipo, edad, color, observaciones } = form;

    if (!nombre.trim() || !tipo.trim() || edad === "" || !color.trim() || !observaciones.trim()) {
      Swal.fire({
        title: "Error",
        text: "Por favor completa todos los campos",
        icon: "error",
        confirmButtonText: "Ok"
      });
      return;
    }

    const mascota = {
      ...form,
      id: mascotaAEditar ? mascotaAEditar.id : Date.now(),
      edad: Number(edad)
    };

    if (mascotaAEditar) {
      editarMascota(mascota);
      Swal.fire({
        title: "Mascota actualizada",
        text: `${form.nombre} ha sido actualizada.`,
        icon: "success",
        timer: 1500
      });
    } else {
      agregarMascota(mascota);
      Swal.fire({
        title: "Mascota registrada",
        text: `${form.nombre} ha sido agregada.`,
        icon: "success",
        timer: 1500
      });
    }

    setForm(formularioInicial);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "20px",
        maxWidth: "400px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "20px"
      }}
    >
      <h2 style={{ marginBottom: "16px" }}>
        {mascotaAEditar ? "Editar Mascota" : "Registrar Mascota"}
      </h2>

      {["nombre", "tipo", "edad", "color"].map((campo) => (
        <div key={campo} style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
            {campo.charAt(0).toUpperCase() + campo.slice(1)}
          </label>
          <input
            type={campo === "edad" ? "number" : "text"}
            min={campo === "edad" ? 0 : undefined}
            name={campo}
            placeholder={campo === "tipo" ? "Perro, Gato..." : ""}
            value={form[campo]}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
      ))}

      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Observaciones</label>
        <textarea
          name="observaciones"
          placeholder="Observaciones"
          value={form.observaciones}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", minHeight: "60px" }}
        />
      </div>

      <label style={{ display: "flex", alignItems: "center", marginBottom: "16px", gap: "8px", fontWeight: "600" }}>
        <input
          type="checkbox"
          name="vacunado"
          checked={form.vacunado}
          onChange={handleChange}
          style={{ width: "16px", height: "16px" }}
        />
        ¿Vacunado?
      </label>

      <button
        type="submit"
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "10px 16px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "600",
          width: "100%"
        }}
      >
        {mascotaAEditar ? "Editar mascota" : "Agregar mascota"}
      </button>
    </form>
  );
};

export default FormularioMascota;
