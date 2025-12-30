import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listarRobotsPorCompetidor, registrarRobot, eliminarRobot, modificarRobot, modificarCompetidor, listarCategorias, obtenerClubPorCompetidor } from "../../api";
import "./Perfil.css";

const PerfilCompetidor = ({ competidorActivo, setCompetidorActivo }) => {
    const [userData, setUserData] = useState(null);
    const [robots, setRobots] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRobotModal, setShowRobotModal] = useState(false);
    const [showEditRobotModal, setShowEditRobotModal] = useState(false);
    const [editingRobot, setEditingRobot] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [robotForm, setRobotForm] = useState({
        nombre: "",
        foto: "",
        categoria: "",
        peso: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [categorias, setCategorias] = useState([]);
    const [club, setClub] = useState(null);

    const fetchRobots = async (userId) => {
        try {
            const data = await listarRobotsPorCompetidor(userId);
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

    // Cargar categorías desde la API
    useEffect(() => {
        const cargarCategorias = async () => {
            try {
                const data = await listarCategorias();
                setCategorias(data || []);
            } catch (err) {
                console.error("Error cargando categorías:", err);
            }
        };
        cargarCategorias();
    }, []);

    // Cargar Club del competidor
    useEffect(() => {
        const cargarClub = async () => {
            if (userData?.id) {
                try {
                    const clubData = await obtenerClubPorCompetidor(userData.id);
                    setClub(clubData);
                } catch (error) {
                    // Es posible que no tenga club, no es un error crítico
                    console.log("El competidor no tiene club asignado o error al cargar:", error);
                }
            }
        };
        cargarClub();
    }, [userData]);

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleRobotChange = (e) => {
        setRobotForm({ ...robotForm, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async () => {
        // Validación antes de enviar
        if (!editForm.apodo?.trim()) {
            setMessage({ type: "error", text: "El apodo es requerido" });
            return;
        }
        if (!editForm.nombres?.trim()) {
            setMessage({ type: "error", text: "El nombre es requerido" });
            return;
        }
        if (!editForm.correo?.trim()) {
            setMessage({ type: "error", text: "El correo es requerido" });
            return;
        }

        setLoading(true);
        try {
            // Estructura según CompetidorDTO del backend
            const competidorDTO = {
                id: userData.id,
                apodo: editForm.apodo.trim(),
                nombres: editForm.nombres.trim(),
                correo: editForm.correo.trim(),
                dni: userData.dni, // DNI no se puede cambiar
                foto: editForm.foto || "",
            };

            const competidorActualizado = await modificarCompetidor(competidorDTO);

            // Actualizar datos locales
            setUserData(competidorActualizado);
            setCompetidorActivo(competidorActualizado);
            localStorage.setItem("UsuarioData", JSON.stringify(competidorActualizado));

            setShowEditModal(false);
            setMessage({ type: "success", text: "Perfil actualizado correctamente" });
        } catch (err) {
            const errorMsg = err.response?.data || err.message;
            setMessage({ type: "error", text: typeof errorMsg === 'string' ? errorMsg : "Error al actualizar perfil" });
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
            await registrarRobot(userData.id, {
                nombre: robotForm.nombre,
                foto: robotForm.foto || "",
                categoria: robotForm.categoria,
                peso: parseInt(robotForm.peso) || 0
            });
            await fetchRobots(userData.id); // Recargar lista
            setRobotForm({ nombre: "", foto: "", categoria: "", peso: "" });
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
            await eliminarRobot(id);
            await fetchRobots(userData.id);
            setMessage({ type: "success", text: "Robot eliminado" });
        } catch (error) {
            setMessage({ type: "error", text: "Error al eliminar robot" });
        }
    };

    const handleEditRobot = (robot) => {
        setEditingRobot({
            id: robot.id,
            nombre: robot.nombre || "",
            foto: robot.foto || "",
            categoria: typeof robot.categoria === 'object' ? robot.categoria?.nombre : robot.categoria || "",
            peso: robot.peso || ""
        });
        setShowEditRobotModal(true);
    };

    const handleEditRobotChange = (e) => {
        setEditingRobot({ ...editingRobot, [e.target.name]: e.target.value });
    };

    const handleUpdateRobot = async () => {
        if (!editingRobot.nombre) {
            setMessage({ type: "error", text: "El nombre del robot es requerido" });
            return;
        }

        setLoading(true);
        try {
            await modificarRobot({
                id: editingRobot.id,
                nombre: editingRobot.nombre,
                foto: editingRobot.foto || "",
                peso: parseInt(editingRobot.peso) || 0
            });
            await fetchRobots(userData.id);
            setShowEditRobotModal(false);
            setEditingRobot(null);
            setMessage({ type: "success", text: "Robot actualizado exitosamente" });
        } catch (err) {
            setMessage({ type: "error", text: "Error al actualizar robot" });
        } finally {
            setLoading(false);
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

                        {club && (
                            <Link to={`/club-competidor/${club.idClub}`} style={{ textDecoration: 'none' }}>
                                <p className="perfil-club" style={{
                                    color: '#fbbf24',
                                    marginTop: '5px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s'
                                }}
                                    onMouseOver={(e) => e.target.style.color = '#f59e0b'}
                                    onMouseOut={(e) => e.target.style.color = '#fbbf24'}
                                >
                                    🛡️ Club: {club.nombreClub}
                                </p>
                            </Link>
                        )}
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
                            ➕ Registrar Robot
                        </button>
                    </div>

                    {robots.length > 0 ? (
                        <div className="robots-grid">
                            {robots.map((robot) => (
                                <div key={robot.id} className="robot-card" style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(6, 182, 212, 0.3)'
                                }}>
                                    {/* Foto del robot */}
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        marginBottom: '0.75rem',
                                        border: '2px solid rgba(6, 182, 212, 0.5)',
                                        background: 'rgba(51, 65, 85, 0.5)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {robot.foto ? (
                                            <img
                                                src={robot.foto}
                                                alt={robot.nombre}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                                            />
                                        ) : null}
                                        <span style={{
                                            fontSize: '2.5rem',
                                            display: robot.foto ? 'none' : 'block'
                                        }}>🤖</span>
                                    </div>

                                    <h4 style={{ color: '#fff', margin: '0 0 0.5rem', fontSize: '1rem' }}>{robot.nombre}</h4>
                                    <p className="robot-categoria" style={{
                                        color: '#06b6d4',
                                        margin: '0 0 0.75rem',
                                        fontSize: '0.85rem'
                                    }}>
                                        {typeof robot.categoria === 'object' ? robot.categoria?.nombre : robot.categoria}
                                    </p>

                                    {/* Botones */}
                                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                        <button
                                            onClick={() => handleEditRobot(robot)}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid #06b6d4',
                                                color: '#06b6d4',
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRobot(robot.id)}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid #ef4444',
                                                color: '#ef4444',
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <span>🔧</span>
                            <p>No tienes robots en tu hangar</p>
                            <button className="btn-secondary" onClick={() => setShowRobotModal(true)}>
                                Registrar mi primer robot
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
                                <label>Apodo *</label>
                                <input
                                    type="text"
                                    name="apodo"
                                    value={editForm.apodo || ""}
                                    onChange={handleEditChange}
                                    placeholder="Tu apodo de competidor"
                                />
                            </div>
                            <div className="form-group">
                                <label>Nombre Completo *</label>
                                <input
                                    type="text"
                                    name="nombres"
                                    value={editForm.nombres || ""}
                                    onChange={handleEditChange}
                                    placeholder="Tu nombre completo"
                                />
                            </div>
                            <div className="form-group">
                                <label>Correo Electrónico *</label>
                                <input
                                    type="email"
                                    name="correo"
                                    value={editForm.correo || ""}
                                    onChange={handleEditChange}
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>DNI</label>
                                <input
                                    type="text"
                                    value={userData?.dni || ""}
                                    disabled
                                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                                />
                                <small style={{ color: '#888', fontSize: '0.75rem' }}>El DNI no se puede modificar</small>
                            </div>
                            <div className="form-group">
                                <label>Foto de Perfil (URL)</label>
                                <input
                                    type="url"
                                    name="foto"
                                    value={editForm.foto || ""}
                                    onChange={handleEditChange}
                                    placeholder="https://ejemplo.com/foto.jpg"
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
                            <h3>🤖 Registrar Robot</h3>
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
                                <label>Habilidad *</label>
                                <select
                                    name="categoria"
                                    value={robotForm.categoria}
                                    onChange={handleRobotChange}
                                >
                                    <option disabled value="">Selecciona la habilidad</option>
                                    {categorias.map((cat) => (
                                        <option key={cat.id || cat.nombre} value={cat.nombre}>
                                            {cat.habilidad}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Peso (g) *</label>
                                <input
                                    type="number"
                                    name="peso"
                                    value={robotForm.peso}
                                    onChange={handleRobotChange}
                                    placeholder="500"
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label>Foto del Robot (URL)</label>
                                <input
                                    type="url"
                                    name="foto"
                                    value={robotForm.foto}
                                    onChange={handleRobotChange}
                                    placeholder="https://ejemplo.com/mi-robot.jpg"
                                />
                                {robotForm.foto && (
                                    <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                                        <img
                                            src={robotForm.foto}
                                            alt="Preview"
                                            style={{
                                                maxWidth: '100px',
                                                maxHeight: '100px',
                                                borderRadius: '8px',
                                                border: '2px solid rgba(6, 182, 212, 0.5)'
                                            }}
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    </div>
                                )}
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

            {/* Modal Editar Robot */}
            {showEditRobotModal && editingRobot && (
                <div className="modal-overlay" onClick={() => setShowEditRobotModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>✏️ Editar Robot</h3>
                            <button className="modal-close" onClick={() => setShowEditRobotModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nombre del Robot *</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={editingRobot.nombre}
                                    onChange={handleEditRobotChange}
                                    placeholder="MechaKnight 3000"
                                />
                            </div>
                            <div className="form-group">
                                <label>Peso (g)</label>
                                <input
                                    type="number"
                                    name="peso"
                                    value={editingRobot.peso}
                                    onChange={handleEditRobotChange}
                                    placeholder="500"
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Foto del Robot (URL)</label>
                                <input
                                    type="url"
                                    name="foto"
                                    value={editingRobot.foto}
                                    onChange={handleEditRobotChange}
                                    placeholder="https://ejemplo.com/mi-robot.jpg"
                                />
                                {editingRobot.foto && (
                                    <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                                        <img
                                            src={editingRobot.foto}
                                            alt="Preview"
                                            style={{
                                                maxWidth: '100px',
                                                maxHeight: '100px',
                                                borderRadius: '8px',
                                                border: '2px solid rgba(6, 182, 212, 0.5)'
                                            }}
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowEditRobotModal(false)}>
                                Cancelar
                            </button>
                            <button className="btn-primary" onClick={handleUpdateRobot} disabled={loading}>
                                {loading ? "Guardando..." : "Actualizar Robot"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PerfilCompetidor;
