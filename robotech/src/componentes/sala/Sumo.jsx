import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { torneosData } from "../../data/torneosData";
import { getRobots } from "../service/apiService";
import { useInscripcion } from "../../hooks/useInscripcion";
import "./Sala.css";

const Sumo = () => {
    // ID ESPECÍFICO
    const torneo = torneosData.find(t => t.id === "sumo-1");

    const [competidor, setCompetidor] = useState(null);
    const [robots, setRobots] = useState([]);
    const [selectedRobot, setSelectedRobot] = useState("");
    const [showModal, setShowModal] = useState(false);

    // HOOK DE INSCRIPCIÓN
    const {
        inscrito,
        mensaje,
        setMensaje,
        inscribir,
        retirar,
        competidoresReales
    } = useInscripcion(torneo.id, torneo.categoriaRequerida);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("UsuarioData"));
        setCompetidor(user);
        if (user) {
            cargarRobots(user.id);
        }
    }, []);

    const cargarRobots = async (id) => {
        try {
            const data = await getRobots(id);
            setRobots(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInscribir = () => {
        if (!competidor) {
            setMensaje("⚠ Inicia sesión como competidor para inscribirte.");
            return;
        }
        if (robots.length === 0) {
            setMensaje("⛔ No tienes robots. Crea uno en tu perfil.");
            return;
        }
        if (mensaje && mensaje.includes("✅")) setMensaje("");
        setShowModal(true);
    };

    const confirmar = () => {
        if (!selectedRobot) return;
        const robotObj = robots.find(r => r.id === selectedRobot);
        const exito = inscribir(robotObj, competidor);
        if (exito) {
            setShowModal(false);
        }
    };

    if (!torneo) return <div className="text-white">Torneo no encontrado</div>;

    return (
        <div className="sala-page">
            <div className="video-background-layer">
                {torneo.isLocalVideo ? (
                    <video className="bg-video" autoPlay muted loop playsInline>
                        <source src={torneo.videoBackground} type="video/mp4" />
                    </video>
                ) : (
                    <iframe className="bg-iframe" src={torneo.videoBackground} />
                )}
                <div className="bg-overlay"></div>
            </div>

            <div className="sala-container-split">
                <header className="sala-header">
                    <div className="header-title">
                        <span>{torneo.icono}</span>
                        <h1>{torneo.nombre}</h1>
                    </div>
                    <Link to="/torneos" className="btn-back-nav">◀ VOLVER</Link>
                </header>

                <div className="split-top-section">
                    <div className="image-col">
                        <img src={torneo.imagen} alt={torneo.nombre} className="medium-image" />
                    </div>
                    <div className="desc-col">
                        <h2>Detalles del Evento</h2>
                        <div className="desc-text">
                            {torneo.descripcion}
                            <div className="mt-3" style={{ color: '#fbbf24' }}>
                                <strong>Requisito:</strong> Solo robots categoría "{torneo.categoriaRequerida}".
                            </div>
                        </div>
                        <div className="stats-row">
                            <span className="stat-badge">🕒 {torneo.hora}</span>
                            <span className="stat-badge">👥 {torneo.inscritos + competidoresReales.length} Participantes</span>
                            <span className="stat-badge">🏆 S/ {torneo.premios.primero}</span>
                        </div>
                    </div>
                </div>

                <div className="inscription-section">
                    <h3>🚀 ¡Participa en la Batalla!</h3>
                    {mensaje && <div className="mensaje-alerta" style={{ color: mensaje.includes('✅') ? '#4ade80' : '#ffaaaa', background: mensaje.includes('✅') ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 0, 0, 0.2)' }}>{mensaje}</div>}

                    {inscrito ? (
                        <div className="status-ready">
                            <div style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#4ade80', fontWeight: 'bold' }}>✅ ¡ROBOT EN COMPETENCIA!</div>
                            <button
                                className="btn btn-danger"
                                onClick={() => retirar(competidor.id)}
                                style={{ padding: '10px 20px', borderRadius: '50px', fontWeight: 'bold' }}
                            >
                                ❌ Retirar de la competencia
                            </button>
                        </div>
                    ) : (
                        <button className="btn-inscribir" onClick={handleInscribir}>
                            INSCRIBIR MI ROBOT
                        </button>
                    )}
                </div>

                <div className="table-section">
                    <h3>Competidores en Sala</h3>
                    <table className="competitors-table">
                        <thead>
                            <tr>
                                <th>Robot</th>
                                <th>Club / Dueño</th>
                                <th>Estado</th>
                                <th>Victorias</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="row-static">
                                <td className="robot-cell">🔪 SpeedyBot</td>
                                <td className="club-cell">Iron Club</td>
                                <td className="status-cell">Listo</td>
                                <td>3</td>
                            </tr>
                            {competidoresReales.map((c, index) => (
                                <tr className="row-user" key={`comp-${index}`}>
                                    <td className="robot-cell">🤖 {c.robotNombre}</td>
                                    <td className="club-cell">{c.usuarioNombre}</td>
                                    <td className="status-cell" style={{ color: '#4ade80' }}>{c.estado}</td>
                                    <td>{c.victorias}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Selecciona tu Combatiente</h3>
                        <p className="text-muted mb-3">Solo se mostrarán robots de categoría: <strong style={{ color: '#fbbf24' }}>{torneo.categoriaRequerida}</strong></p>
                        <div className="robot-list">
                            {robots.filter(r => r.categoria === torneo.categoriaRequerida).length > 0 ? (
                                robots.filter(r => r.categoria === torneo.categoriaRequerida).map(r => (
                                    <div
                                        key={r.id}
                                        className={`robot-item ${selectedRobot === r.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedRobot(r.id)}
                                    >
                                        {r.nombre} ({r.categoria})
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 text-center text-muted">
                                    No tienes robots habilitados para esta categoría.
                                </div>
                            )}
                        </div>
                        <div className="d-flex justify-content-center gap-2 mt-3">
                            <button className="btn btn-outline-light" onClick={() => setShowModal(false)}>Cancelar</button>
                            <button
                                className="btn btn-success"
                                onClick={confirmar}
                                disabled={!selectedRobot || robots.filter(r => r.categoria === torneo.categoriaRequerida).length === 0}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sumo;
