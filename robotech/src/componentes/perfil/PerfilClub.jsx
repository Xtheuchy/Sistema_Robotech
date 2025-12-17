import React, { useState, useEffect } from "react";
import { generarCodigoClub, getMiembrosClub } from "../service/apiService";
import "./Perfil.css";

const PerfilClub = ({ clubActivo }) => {
    const [clubData, setClubData] = useState(null);
    const [miembros, setMiembros] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCodigoModal, setShowCodigoModal] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [copiado, setCopiado] = useState(false);

    useEffect(() => {
        if (clubActivo) {
            setClubData(clubActivo);
            setEditForm(clubActivo);
            fetchMiembros(clubActivo.id);
        }
    }, [clubActivo]);

    const fetchMiembros = async (id) => {
        try {
            const miembrosData = await getMiembrosClub(id);
            setMiembros(miembrosData);
        } catch (error) {
            console.error("Error cargando miembros", error);
        }
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            localStorage.setItem("clubActivo", JSON.stringify(editForm));
            setClubData(editForm);
            setShowEditModal(false);
            setMessage({ type: "success", text: "Perfil del club actualizado" });
        } catch (err) {
            setMessage({ type: "error", text: "Error al actualizar" });
        } finally {
            setLoading(false);
        }
    };

    const copiarCodigo = () => {
        if (clubData?.codigoClub) {
            navigator.clipboard.writeText(clubData.codigoClub);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        }
    };

    const generarNuevoCodigo = () => {
        const nuevoCodigo = generarCodigoClub();
        const updatedData = { ...clubData, codigoClub: nuevoCodigo };
        localStorage.setItem("clubActivo", JSON.stringify(updatedData));
        setClubData(updatedData);
        setMessage({ type: "success", text: "Nuevo código generado: " + nuevoCodigo });
    };

    if (!clubData) {
        return (
            <div className="page-wrapper">
                <div className="container">
                    <p>Cargando perfil del club...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper perfil-page">
            <div className="perfil-bg club-bg"></div>

            <div className="container">
                {message.text && (
                    <div className={`alert alert-${message.type}`}>{message.text}</div>
                )}

                {/* Header del perfil */}
                <div className="perfil-header club-header">
                    <div className="perfil-avatar club-avatar">
                        {clubData.logo ? (
                            <img src={clubData.logo} alt={clubData.nombreClub} />
                        ) : (
                            <span>🏢</span>
                        )}
                    </div>
                    <div className="perfil-info">
                        <h1>¡Bienvenido, <span className="text-gradient">{clubData.nombreClub}!</span></h1>
                        <p className="perfil-email">{clubData.responsableCorreo}</p>
                        <p className="perfil-badge">✅ Club Verificado</p>
                    </div>
                </div>

                {/* Cards principales */}
                <div className="club-cards-grid">
                    {/* Card Miembros Activos */}
                    <div className="club-card miembros-card">
                        <div className="card-header">
                            <h3>👥 Miembros Activos</h3>
                            <span className="member-count">{miembros.length}</span>
                        </div>
                        <div className="card-body">
                            {miembros.length > 0 ? (
                                <div className="miembros-list">
                                    {miembros.map((m) => (
                                        <div key={m.id} className="miembro-item">
                                            <span className="miembro-avatar">🤖</span>
                                            <div className="miembro-info">
                                                <span className="miembro-nombre">{m.nombre}</span>
                                                <span className="miembro-apodo">@{m.apodo}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="empty-text">No hay miembros registrados</p>
                            )}
                        </div>
                    </div>

                    {/* Card Editar Perfil */}
                    <div className="club-card edit-card">
                        <div className="card-header">
                            <h3>✏️ Editar Perfil</h3>
                        </div>
                        <div className="card-body">
                            <p>Actualiza la información de tu club</p>
                            <button className="btn-primary" onClick={() => setShowEditModal(true)}>
                                Editar Información
                            </button>
                        </div>
                    </div>
                </div>

                {/* Código de Club */}
                <div className="perfil-section codigo-section">
                    <h3>🔑 Código de Gestión</h3>
                    <p className="codigo-description">
                        Comparte este código con los competidores para que se unan a tu club
                    </p>

                    <div className="codigo-container">
                        <div className="codigo-display">
                            <span className="codigo-value">{clubData.codigoClub || "Sin código"}</span>
                            <button className="btn-copy" onClick={copiarCodigo}>
                                {copiado ? "✅ Copiado" : "📋 Copiar"}
                            </button>
                        </div>
                        <button className="btn-secondary" onClick={generarNuevoCodigo}>
                            🔄 Generar Nuevo Código
                        </button>
                    </div>
                </div>

                {/* Tabla de miembros */}
                <div className="perfil-section">
                    <h3>📋 Registro de Competidores</h3>
                    {miembros.length > 0 ? (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nombre</th>
                                        <th>Apodo</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {miembros.map((m, idx) => (
                                        <tr key={m.id}>
                                            <td>{idx + 1}</td>
                                            <td>{m.nombre}</td>
                                            <td>@{m.apodo}</td>
                                            <td><span className="badge-active">Activo</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <span>👥</span>
                            <p>Los competidores aparecerán aquí cuando ingresen tu código</p>
                        </div>
                    )}
                </div>

                {/* Info del responsable */}
                <div className="perfil-section">
                    <h3>👤 Información del Responsable</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Nombre</span>
                            <span className="info-value">{clubData.responsableNombre}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">DNI</span>
                            <span className="info-value">{clubData.responsableDni}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Teléfono</span>
                            <span className="info-value">{clubData.telefono}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Dirección</span>
                            <span className="info-value">{clubData.direccion}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Editar Perfil */}
            {showEditModal && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>✏️ Editar Perfil del Club</h3>
                            <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nombre del Club</label>
                                <input
                                    type="text"
                                    name="nombreClub"
                                    value={editForm.nombreClub || ""}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Dirección</label>
                                <input
                                    type="text"
                                    name="direccion"
                                    value={editForm.direccion || ""}
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
                            <div className="form-group">
                                <label>Nombre del Responsable</label>
                                <input
                                    type="text"
                                    name="responsableNombre"
                                    value={editForm.responsableNombre || ""}
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
        </div>
    );
};

export default PerfilClub;
