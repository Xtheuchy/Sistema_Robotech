import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { listarIntegrantesClub, obtenerClubPorId } from "../../api";
import "./Perfil.css";

const ClubCompetidor = () => {
    const { id } = useParams();
    const [clubData, setClubData] = useState(null);
    const [miembros, setMiembros] = useState([]);
    const [message, setMessage] = useState({ type: "", text: "" });


    // Efecto para cargar datos
    useEffect(() => {
        const cargarDatos = async () => {
            if (id) {
                try {
                    const data = await obtenerClubPorId(id);
                    setClubData(data);
                    fetchMiembros(data.id);
                } catch (error) {
                    console.error("Error cargando club por ID:", error);
                    setMessage({ type: "error", text: "No se pudo cargar el club." });
                }
            }
        };
        cargarDatos();
    }, [id]);

    const fetchMiembros = async (id) => {
        try {
            const miembrosData = await listarIntegrantesClub(id);
            setMiembros(miembrosData);
        } catch (error) {
            console.error("Error cargando miembros", error);
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
                        <h1>
                            <span className="text-gradient">
                                {typeof clubData.propietario === 'object'
                                    ? (clubData.propietario.apodo || clubData.propietario.nombres || 'Propietario')
                                    : (clubData.propietario || 'Propietario')}
                            </span>
                        </h1>
                        <p className="perfil-club-name" style={{ fontSize: '1.3rem', color: '#a78bfa', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            🏢 {clubData.clubNombre || clubData.nombre || 'Nombre del Club'}
                        </p>
                        <p className="perfil-email">{clubData.correo || clubData.email}</p>
                    </div>
                </div>

                {/* Datos del Propietario (Solo Lectura) */}
                <div className="perfil-section" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0 }}>👤 Datos del Propietario</h3>
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
                                <span className="info-value">
                                    {typeof clubData.propietario === 'object'
                                        ? (clubData.propietario.nombres || clubData.propietario.apodo)
                                        : clubData.propietario}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Correo</span>
                                <span className="info-value">{clubData.correo}</span>
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

                {/* Estadísticas y Código */}
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
        </div>
    );
};

export default ClubCompetidor;
