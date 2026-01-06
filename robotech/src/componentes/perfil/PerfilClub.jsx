import React, { useState, useEffect } from "react";
import { generarCodigoInvitacion, listarIntegrantesClub, modificarClub, actualizarUsuario } from "../../api";
import Swal from 'sweetalert2';
import "./Perfil.css";

const PerfilClub = ({ clubActivo }) => {
    const [clubData, setClubData] = useState(null);
    const [clubId, setClubId] = useState(null); // ID real del club para la API
    const [propietarioUserId, setPropietarioUserId] = useState(null); // ID del usuario propietario
    const [miembros, setMiembros] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showOwnerModal, setShowOwnerModal] = useState(false);
    const [showCodigoModal, setShowCodigoModal] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [ownerForm, setOwnerForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [clubEditError, setClubEditError] = useState(""); // Error para modal editar club
    const [ownerEditError, setOwnerEditError] = useState(""); // Error para modal editar propietario
    const [copiado, setCopiado] = useState(false);

    useEffect(() => {
        const cargarDatosClub = async () => {
            if (clubActivo) {
                console.log("=== DEBUG clubActivo ===");
                console.log("clubActivo completo:", clubActivo);

                // Detectar si los campos están intercambiados
                // Si propietario contiene "http" es porque tiene la URL de la foto
                const camposIntercambiados = clubActivo.propietario && clubActivo.propietario.startsWith('http');

                let datosCorregidos;
                if (camposIntercambiados) {
                    console.log("⚠️ Campos intercambiados detectados, corrigiendo...");
                    datosCorregidos = {
                        ...clubActivo,
                        // Intercambiar propietario <-> propietarioFoto
                        propietario: clubActivo.propietarioFoto,
                        propietarioFoto: clubActivo.propietario,
                        // Intercambiar logo <-> direccion
                        logo: clubActivo.direccion,
                        direccion: clubActivo.logo
                    };
                } else {
                    datosCorregidos = clubActivo;
                }

                console.log("Datos corregidos:", datosCorregidos);
                console.log("=========================");

                // clubActivo ya viene con los datos del club desde Login.jsx
                // clubActivo.id = ID del club
                // clubActivo.idPropietario = ID del usuario propietario

                // Guardar el ID del usuario propietario
                setPropietarioUserId(clubActivo.idPropietario);

                // Usar los datos corregidos
                setClubData(datosCorregidos);
                setClubId(clubActivo.id); // El ID del club
                setEditForm(datosCorregidos);
                setOwnerForm(datosCorregidos);

                // Cargar miembros usando el ID del club
                if (clubActivo.id) {
                    fetchMiembros(clubActivo.id);
                }
            }
        };
        cargarDatosClub();
    }, [clubActivo]);

    const fetchMiembros = async (id) => {
        try {
            const miembrosData = await listarIntegrantesClub(id);
            setMiembros(miembrosData);
        } catch (error) {
            console.error("Error cargando miembros", error);
        }
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleOwnerChange = (e) => {
        setOwnerForm({ ...ownerForm, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async () => {
        setClubEditError(""); // Limpiar error previo
        setLoading(true);
        try {
            // Crear DTO para la API según ModificarClubDTO
            const modificarClubDTO = {
                id: clubId || clubData?.id,
                nombreClub: editForm.clubNombre || editForm.nombreClub,
                telefonoClub: editForm.telefono,
                logo: editForm.logo,
                direccionClub: editForm.direccion
            };

            console.log("Enviando a API:", modificarClubDTO); // DEBUG

            // Llamar a la API
            await modificarClub(modificarClubDTO);

            // Actualizar datos locales
            const updatedData = {
                ...clubData,
                clubNombre: modificarClubDTO.nombreClub,
                telefono: modificarClubDTO.telefonoClub,
                logo: modificarClubDTO.logo,
                direccion: modificarClubDTO.direccionClub
            };
            localStorage.setItem("clubActivo", JSON.stringify(updatedData));
            setClubData(updatedData);
            setEditForm(updatedData);
            setClubEditError("");
            setShowEditModal(false);
            Swal.fire({
                title: '¡Éxito!',
                text: 'Datos del club actualizados correctamente',
                icon: 'success',
                background: '#1e293b',
                color: '#fff',
                confirmButtonColor: '#a855f7'
            });
        } catch (err) {
            console.error("Error actualizando club:", err);
            const errorMsg = err.response?.data || "Error al actualizar el club";
            setClubEditError(typeof errorMsg === 'string' ? errorMsg : 'Error al actualizar el club');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveOwner = async () => {
        setOwnerEditError(""); // Limpiar error previo
        setLoading(true);
        try {
            // Obtener datos ORIGINALES del propietario desde propietarioData (no sobrescrito)
            const propietarioOriginal = JSON.parse(localStorage.getItem("propietarioData") || "{}");
            const savedData = JSON.parse(localStorage.getItem("clubActivo") || "{}");

            // Crear DTO según RegistroDTO (campos requeridos por el backend)
            const usuarioDTO = {
                nombres: ownerForm.propietario,  // El nombre se mapea a 'propietario' en el frontend
                correo: ownerForm.correo,
                dni: propietarioOriginal.dni || savedData.dni || clubActivo?.dni || "",  // DNI desde datos originales
                password: "",  // No actualizar password
                foto: ownerForm.propietarioFoto || ownerForm.foto || "",
                rol: propietarioOriginal.rol || savedData.rol || clubActivo?.rol || "Dueño de club"  // Rol desde datos originales
            };

            // ID del usuario (propietario) - usar el ID de propietarioData (datos originales del login)
            const userId = propietarioOriginal.id || clubData?.idPropietario || propietarioUserId;

            console.log("Actualizando usuario ID:", userId, "(propietarioOriginal.id:", propietarioOriginal.id, ") DTO:", usuarioDTO); // DEBUG

            // Llamar a la API
            await actualizarUsuario(userId, usuarioDTO);

            // Actualizar datos locales
            const updatedData = {
                ...clubData,
                propietario: usuarioDTO.nombres,
                correo: usuarioDTO.correo,
                propietarioFoto: usuarioDTO.foto
            };
            localStorage.setItem("clubActivo", JSON.stringify({ ...savedData, ...updatedData }));
            setClubData(updatedData);
            setOwnerForm(updatedData);
            setOwnerEditError("");
            setShowOwnerModal(false);
            Swal.fire({
                title: '¡Éxito!',
                text: 'Datos del propietario actualizados correctamente',
                icon: 'success',
                background: '#1e293b',
                color: '#fff',
                confirmButtonColor: '#a855f7'
            });
        } catch (err) {
            console.error("Error actualizando propietario:", err);
            const errorMsg = err.response?.data || "Error al actualizar el propietario";
            setOwnerEditError(typeof errorMsg === 'string' ? errorMsg : 'Error al actualizar el propietario');
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

    const generarNuevoCodigo = async () => {
        console.log("Generando código... clubId:", clubId); // DEBUG
        if (!clubId) {
            console.log("clubId es null, usando clubData.id:", clubData?.id); // DEBUG
            // Intentar usar clubData.id como fallback
            const idToUse = clubData?.id;
            if (!idToUse) {
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo obtener el ID del club.',
                    icon: 'error',
                    background: '#1e293b',
                    color: '#fff',
                    confirmButtonColor: '#a855f7'
                });
                return;
            }
            // Generar con el fallback ID
            try {
                const nuevoCodigo = await generarCodigoInvitacion(idToUse);
                const updatedData = { ...clubData, codigoClub: nuevoCodigo };
                localStorage.setItem("clubActivo", JSON.stringify(updatedData));
                setClubData(updatedData);
                Swal.fire({
                    title: '¡Código Generado!',
                    text: 'Nuevo código: ' + nuevoCodigo,
                    icon: 'success',
                    background: '#1e293b',
                    color: '#fff',
                    confirmButtonColor: '#a855f7'
                });
            } catch (error) {
                console.error("Error generando código:", error);
                Swal.fire({
                    title: 'Error',
                    text: error.response?.data || 'Error al generar código. Intenta de nuevo.',
                    icon: 'error',
                    background: '#1e293b',
                    color: '#fff',
                    confirmButtonColor: '#a855f7'
                });
            }
            return;
        }
        try {
            // El backend genera el código y lo retorna - usamos el ID real del club
            const nuevoCodigo = await generarCodigoInvitacion(clubId);
            const updatedData = { ...clubData, codigoClub: nuevoCodigo };
            localStorage.setItem("clubActivo", JSON.stringify(updatedData));
            setClubData(updatedData);
            Swal.fire({
                title: '¡Código Generado!',
                text: 'Nuevo código: ' + nuevoCodigo,
                icon: 'success',
                background: '#1e293b',
                color: '#fff',
                confirmButtonColor: '#a855f7'
            });
        } catch (error) {
            console.error("Error generando código:", error);
            Swal.fire({
                title: 'Error',
                text: error.response?.data || 'Error al generar código. Intenta de nuevo.',
                icon: 'error',
                background: '#1e293b',
                color: '#fff',
                confirmButtonColor: '#a855f7'
            });
        }
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
                        <h1>¡Bienvenido, <span className="text-gradient">{clubData.propietario || 'Propietario'}!</span></h1>
                        <p className="perfil-club-name" style={{ fontSize: '1.3rem', color: '#a78bfa', marginBottom: '0.5rem', fontWeight: 'bold' }}>🏢 {clubData.clubNombre || 'Mi Club'}</p>
                        <p className="perfil-email">{clubData.correo}</p>
                    </div>
                    <button
                        className="btn-edit"
                        onClick={() => setShowEditModal(true)}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                        ✏️ Editar Club
                    </button>
                </div>

                {/* Datos del Propietario - debajo de bienvenida */}
                <div className="perfil-section" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0 }}>👤 Datos del Propietario</h3>
                        <button
                            onClick={() => setShowOwnerModal(true)}
                            style={{
                                padding: '0.4rem 0.8rem',
                                fontSize: '0.8rem',
                                background: 'transparent',
                                border: '1px solid rgba(168, 85, 247, 0.5)',
                                borderRadius: '8px',
                                color: '#a78bfa',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.background = 'rgba(168, 85, 247, 0.2)'}
                            onMouseOut={(e) => e.target.style.background = 'transparent'}
                        >
                            ✏️ Editar
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        {/* Foto del propietario */}
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                border: '3px solid rgba(167, 139, 250, 0.5)'
                            }}>
                                {clubData.propietarioFoto ? (
                                    <img src={clubData.propietarioFoto} alt="Propietario" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span>👤</span>
                                )}
                            </div>
                        </div>
                        {/* Info */}
                        <div className="info-grid" style={{ flex: 1 }}>
                            <div className="info-item">
                                <span className="info-label">Nombre</span>
                                <span className="info-value">{clubData.propietario || 'Sin nombre'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Correo</span>
                                <span className="info-value">{clubData.correo || 'Sin correo'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Teléfono</span>
                                <span className="info-value">{clubData.telefono || 'Sin teléfono'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Dirección del Club</span>
                                <span className="info-value">{clubData.direccion || 'Sin dirección'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estadísticas y Código - dos columnas */}
                <div className="perfil-section" style={{ marginBottom: '2rem' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem',
                        alignItems: 'stretch'
                    }}>
                        {/* Columna Miembros */}
                        <div style={{
                            textAlign: 'center',
                            padding: '1.5rem',
                            background: 'linear-gradient(145deg, rgba(6, 182, 212, 0.1) 0%, rgba(26, 26, 46, 0.8) 100%)',
                            borderRadius: '16px',
                            border: '1px solid rgba(6, 182, 212, 0.3)'
                        }}>
                            <h4 style={{ margin: '0 0 1rem 0', color: '#06b6d4' }}>👥 Miembros Activos</h4>
                            <span style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#a78bfa', display: 'block' }}>{miembros.length}</span>
                            <p style={{ color: '#888', margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>competidores en el club</p>
                        </div>

                        {/* Columna Código */}
                        <div style={{
                            textAlign: 'center',
                            padding: '1.5rem',
                            background: 'linear-gradient(145deg, rgba(251, 191, 36, 0.1) 0%, rgba(26, 26, 46, 0.8) 100%)',
                            borderRadius: '16px',
                            border: '1px solid rgba(251, 191, 36, 0.3)'
                        }}>
                            <h4 style={{ margin: '0 0 1rem 0', color: '#fbbf24' }}>🔑 Código de Invitación</h4>
                            <div style={{
                                background: 'rgba(0,0,0,0.3)',
                                padding: '0.75rem 1rem',
                                borderRadius: '10px',
                                marginBottom: '1rem',
                                wordBreak: 'break-all'
                            }}>
                                <span style={{
                                    fontFamily: "'Orbitron', 'Courier New', monospace",
                                    fontSize: clubData.codigoClub?.length > 15 ? '0.9rem' : '1.2rem',
                                    fontWeight: 'bold',
                                    color: '#fbbf24',
                                    letterSpacing: '1px'
                                }}>
                                    {clubData.codigoClub || "Sin código"}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button
                                    className="btn-copy"
                                    onClick={copiarCodigo}
                                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                                >
                                    {copiado ? "✅ Copiado" : "📋 Copiar"}
                                </button>
                                <button
                                    className="btn-secondary"
                                    onClick={generarNuevoCodigo}
                                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                                >
                                    🔄 Generar Código
                                </button>
                            </div>
                        </div>
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
                                            <td>{m.nombres}</td>
                                            <td>@{m.apodo}</td>
                                            <td><span className={`badge-${m.estado?.toLowerCase() || 'active'}`}>{m.estado || 'Activo'}</span></td>
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
            </div>

            {/* Modal Editar Perfil */}
            {showEditModal && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>✏️ Editar Perfil del Club</h3>
                            <button className="modal-close" onClick={() => { setShowEditModal(false); setClubEditError(""); }}>×</button>
                        </div>
                        {clubEditError && (
                            <div style={{
                                background: 'rgba(239, 68, 68, 0.2)',
                                border: '1px solid #ef4444',
                                borderRadius: '8px',
                                padding: '12px 16px',
                                margin: '0 20px 15px 20px',
                                color: '#fca5a5',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span>❌</span>
                                <span>{clubEditError}</span>
                            </div>
                        )}
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nombre del Club</label>
                                <input
                                    type="text"
                                    name="clubNombre"
                                    value={editForm.clubNombre || editForm.nombreClub || ""}
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
                                <label>Teléfono del Club</label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={editForm.telefono || ""}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Logo del Club (URL)</label>
                                <input
                                    type="url"
                                    name="logo"
                                    value={editForm.logo || ""}
                                    onChange={handleEditChange}
                                    placeholder="https://ejemplo.com/logo.jpg"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => { setShowEditModal(false); setClubEditError(""); }}>
                                Cancelar
                            </button>
                            <button className="btn-primary" onClick={handleSaveProfile} disabled={loading}>
                                {loading ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Editar Propietario */}
            {showOwnerModal && (
                <div className="modal-overlay" onClick={() => setShowOwnerModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>👤 Editar Datos del Propietario</h3>
                            <button className="modal-close" onClick={() => { setShowOwnerModal(false); setOwnerEditError(""); }}>×</button>
                        </div>
                        {ownerEditError && (
                            <div style={{
                                background: 'rgba(239, 68, 68, 0.2)',
                                border: '1px solid #ef4444',
                                borderRadius: '8px',
                                padding: '12px 16px',
                                margin: '0 20px 15px 20px',
                                color: '#fca5a5',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span>❌</span>
                                <span>{ownerEditError}</span>
                            </div>
                        )}
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nombre del Propietario</label>
                                <input
                                    type="text"
                                    name="propietario"
                                    value={ownerForm.propietario || ""}
                                    onChange={handleOwnerChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="correo"
                                    value={ownerForm.correo || ""}
                                    onChange={handleOwnerChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Foto del Propietario (URL)</label>
                                <input
                                    type="url"
                                    name="propietarioFoto"
                                    value={ownerForm.propietarioFoto || ""}
                                    onChange={handleOwnerChange}
                                    placeholder="https://ejemplo.com/foto.jpg"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => { setShowOwnerModal(false); setOwnerEditError(""); }}>
                                Cancelar
                            </button>
                            <button className="btn-primary" onClick={handleSaveOwner} disabled={loading}>
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
