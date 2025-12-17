import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRobots, createRobot, updateCompetidor, deleteRobot } from "../service/apiService";
import "./Perfil.css";

const PerfilCompetidor = ({ competidorActivo, setCompetidorActivo }) => {
    const [userData, setUserData] = useState(null);
    const [robots, setRobots] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRobotModal, setShowRobotModal] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [robotForm, setRobotForm] = useState({
        nombre: "",
        categoria: "",
        estado: "activo",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const categorias = [
        "Sumo", "Sumo Extremo", "Laberintos", "Fútbol",
        "Drones", "Batalla IA", "RoboRally", "Rescate"
    ];

    const estados = ["activo", "inactivo", "mantenimiento"];

    const fetchRobots = async (userId) => {
        try {
            const data = await getRobots(userId);
            setRobots(data);
        } catch (error) {
            console.error("Error cargando robots", error);
        }
    };

    useEffect(() => {
        if (competidorActivo) {
            setUserData(competidorActivo);
            setEditForm(competidorActivo);
            fetchRobots(competidorActivo.id);
        }
    }, [competidorActivo]);

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleRobotChange = (e) => {
        setRobotForm({ ...robotForm, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            // Simulación - reemplazar con API real
            // localStorage.setItem("UsuarioData", JSON.stringify(editForm)); // Ya no es necesario si App no lee storage
            setUserData(editForm);
            setCompetidorActivo(editForm); // Actualizar estado global
            setShowEditModal(false);
            setMessage({ type: "success", text: "Perfil actualizado correctamente" });
        } catch (err) {
            setMessage({ type: "error", text: "Error al actualizar perfil" });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRobot = async () => {
        if (!robotForm.nombre || !robotForm.categoria) {
            setMessage({ type: "error", text: "Completa todos los campos del robot" });
            return;
        }

        setLoading(true);
        try {
            await createRobot({ ...robotForm, competidorId: userData.id });
            await fetchRobots(userData.id); // Recargar lista
            setRobotForm({ nombre: "", categoria: "", estado: "activo" });
            setShowRobotModal(false);
            setMessage({ type: "success", text: "Robot creado exitosamente" });
        } catch (err) {
            setMessage({ type: "error", text: "Error al crear robot" });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRobot = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este robot?")) return;
        try {
            await deleteRobot(id);
            await fetchRobots(userData.id);
            setMessage({ type: "success", text: "Robot eliminado" });
        } catch (error) {
            setMessage({ type: "error", text: "Error al eliminar robot" });
        }
    };

    if (!userData) {
        return (
            <div className="page-wrapper">
                <div className="container">
                    <p>Cargando perfil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper perfil-page">
            {/* Background */}
            <div className="perfil-bg"></div>

            <div className="container">
                {message.text && (
                    <div className={`alert alert-${message.type}`}>{message.text}</div>
                )}

                {/* Header del perfil */}
                <div className="perfil-header">
                    <div className="perfil-avatar">
                        {userData.logo ? (
                            <img src={userData.logo} alt={userData.apodo} />
                        ) : (
                            <span>🤖</span>
                        )}
                    </div>
                    <div className="perfil-info">
                        <h1>¡Bienvenido, <span className="text-gradient">
                            {userData.apodo || userData.nombre || userData.nombreClub || userData.responsableNombre || "Competidor"}!
                        </span></h1>
                        <p className="perfil-email">{userData.correo}</p>
                        <p className="perfil-badge">⚡ Competidor Activo</p>
                    </div>
                    <button className="btn-edit" onClick={() => setShowEditModal(true)}>
                        ✏️ Editar Perfil
                    </button>
                </div>

                {/* Hangar de Robots */}
                <div className="perfil-section hangar-section">
                    <div className="section-header-row">
                        <h3>🏭 Hangar de Robots</h3>
                        <button className="btn-primary" onClick={() => setShowRobotModal(true)}>
                            ➕ Construir Robot
                        </button>
                    </div>

                    {robots.length > 0 ? (
                        <div className="robots-grid">
                            {robots.map((robot) => (
                                <div key={robot.id} className="robot-card">
                                    <div className="robot-icon">🤖</div>
                                    <h4>{robot.nombre}</h4>
                                    <p className="robot-categoria">{robot.categoria}</p>
                                    <span className={`robot-estado estado-${robot.estado}`}>
                                        {robot.estado}
                                    </span>
                                    <button
                                        className="btn-delete-robot"
                                        onClick={() => handleDeleteRobot(robot.id)}
                                        style={{ marginTop: '10px', background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <span>🔧</span>
                            <p>No tienes robots en tu hangar</p>
                            <button className="btn-secondary" onClick={() => setShowRobotModal(true)}>
                                Construir mi primer robot
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Editar Perfil */}
            {showEditModal && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>✏️ Editar Perfil</h3>
                            <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={editForm.nombre || ""}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Apellido</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={editForm.apellido || ""}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Apodo</label>
                                <input
                                    type="text"
                                    name="apodo"
                                    value={editForm.apodo || ""}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Teléfono</label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={editForm.telefono || ""}
                                    onChange={handleEditChange}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowEditModal(false)}>
                                Cancelar
                            </button>
                            <button className="btn-primary" onClick={handleSaveProfile} disabled={loading}>
                                {loading ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Crear Robot */}
            {showRobotModal && (
                <div className="modal-overlay" onClick={() => setShowRobotModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>🤖 Construir Robot</h3>
                            <button className="modal-close" onClick={() => setShowRobotModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nombre del Robot *</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={robotForm.nombre}
                                    onChange={handleRobotChange}
                                    placeholder="MechaKnight 3000"
                                />
                            </div>
                            <div className="form-group">
                                <label>Categoría *</label>
                                <select
                                    name="categoria"
                                    value={robotForm.categoria}
                                    onChange={handleRobotChange}
                                >
                                    <option value="">Selecciona categoría</option>
                                    {categorias.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Estado</label>
                                <select
                                    name="estado"
                                    value={robotForm.estado}
                                    onChange={handleRobotChange}
                                >
                                    {estados.map((est) => (
                                        <option key={est} value={est}>{est}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowRobotModal(false)}>
                                Cancelar
                            </button>
                            <button className="btn-primary" onClick={handleCreateRobot} disabled={loading}>
                                {loading ? "Creando..." : "Guardar Robot"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PerfilCompetidor;
