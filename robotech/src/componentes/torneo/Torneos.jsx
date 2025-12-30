import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { listarTorneosPublicos, listarInscripcionesPorTorneo } from "../../api";

// Imagen por defecto si el torneo no tiene imagen
import imagenDefault from "../../assets/imagenes/sumo1.jpeg";

export default function Torneos() {
  const [search, setSearch] = useState("");
  const [torneos, setTorneos] = useState([]);
  const [inscripciones, setInscripciones] = useState({}); // {torneoId: count}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarTorneos = async () => {
      try {
        setLoading(true);
        const data = await listarTorneosPublicos();
        console.log("Torneos públicos:", data);
        setTorneos(data || []);
        setError(null);

        // Cargar inscripciones para cada torneo
        if (data && data.length > 0) {
          const inscripcionesTemp = {};
          await Promise.all(
            data.map(async (torneo) => {
              try {
                const inscritos = await listarInscripcionesPorTorneo(torneo.id);
                inscripcionesTemp[torneo.id] = Array.isArray(inscritos) ? inscritos.length : 0;
              } catch (err) {
                inscripcionesTemp[torneo.id] = 0;
              }
            })
          );
          setInscripciones(inscripcionesTemp);
        }
      } catch (err) {
        console.error("Error cargando torneos:", err);
        setError("No se pudieron cargar los torneos");
        setTorneos([]);
      } finally {
        setLoading(false);
      }
    };
    cargarTorneos();
  }, []);

  const torneosFiltrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    return torneos.filter(t =>
      t.nombreTorneo?.toLowerCase().includes(q)
    );
  }, [search, torneos]);

  if (loading) {
    return (
      <section className="py-5 omega-about-bg omega-destello">
        <div className="container text-center">
          <h3 className="fw-bold mb-5 display-5 omega-title-upgraded">
            Próximos Torneos
          </h3>
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 omega-text-card">Cargando torneos...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5 omega-about-bg omega-destello">
      <div className="container text-center">
        <h3 className="fw-bold mb-5 display-5 omega-title-upgraded">
          Próximos Torneos
        </h3>

        {error && (
          <div className="alert alert-warning mb-4">{error}</div>
        )}

        <div className="input-group mb-4 w-50 mx-auto">
          <span className="input-group-text">🔎</span>
          <input
            type="search"
            className="form-control"
            placeholder="Buscar torneo por nombre..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="row g-4">
          {torneosFiltrados.length > 0 ? torneosFiltrados.map((t, i) => (
            <div key={t.id || i} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <Link to={`/sala/${t.id}`} style={{ textDecoration: 'none' }}>
                <div
                  className="torneo-card h-100"
                  style={{
                    background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(6, 182, 212, 0.3), 0 0 30px rgba(168, 85, 247, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.6)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                  }}
                >
                  {/* IMAGEN CON OVERLAY */}
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                    <img
                      src={t.fotoTorneo || imagenDefault}
                      alt={t.nombreTorneo}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }}
                      onError={e => e.target.src = imagenDefault}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '80px',
                      background: 'linear-gradient(transparent, rgba(15, 23, 42, 1))'
                    }} />
                    {/* Badge de estado */}
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)'
                    }}>
                      {t.estado || 'Público'}
                    </span>
                  </div>

                  {/* CONTENIDO */}
                  <div style={{ padding: '1.25rem' }}>
                    <h5 style={{
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '1.3rem' }}>🏆</span>
                      {t.nombreTorneo}
                    </h5>

                    {/* Info badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '0.75rem' }}>
                      {t.fechaInicio && (
                        <span style={{
                          background: 'rgba(6, 182, 212, 0.2)',
                          color: '#06b6d4',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          📅 {t.fechaInicio}
                        </span>
                      )}
                      {t.nombreCategoria && (
                        <span style={{
                          background: 'rgba(168, 85, 247, 0.2)',
                          color: '#a78bfa',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          🤖 {t.nombreCategoria}
                        </span>
                      )}
                    </div>

                    {/* Contador de inscritos */}
                    {(() => {
                      const inscritos = inscripciones[t.id] || 0;
                      const maxParticipantes = t.cantidadParticipantes || 8;
                      const porcentaje = Math.min((inscritos / maxParticipantes) * 100, 100);
                      const estaLleno = inscritos >= maxParticipantes;

                      return (
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '6px'
                          }}>
                            <span style={{
                              fontSize: '0.8rem',
                              color: 'rgba(255,255,255,0.7)',
                              fontWeight: '500'
                            }}>
                              👥 Inscritos
                            </span>
                            <span style={{
                              fontSize: '0.85rem',
                              fontWeight: 'bold',
                              color: estaLleno ? '#ef4444' : '#4ade80'
                            }}>
                              {inscritos} / {maxParticipantes}
                            </span>
                          </div>
                          <div style={{
                            width: '100%',
                            height: '6px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${porcentaje}%`,
                              height: '100%',
                              background: estaLleno
                                ? 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
                                : 'linear-gradient(90deg, #4ade80 0%, #22c55e 100%)',
                              borderRadius: '3px',
                              transition: 'width 0.5s ease'
                            }} />
                          </div>
                        </div>
                      );
                    })()}

                    {/* Botón Ver Detalle */}
                    <button
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
                      }}
                      onMouseOver={e => e.target.style.transform = 'scale(1.02)'}
                      onMouseOut={e => e.target.style.transform = 'scale(1)'}
                    >
                      👁️ Ver Detalle
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          )) : (
            <div className="col-12">
              <div style={{
                background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
                borderRadius: '20px',
                padding: '3rem',
                textAlign: 'center',
                border: '1px solid rgba(6, 182, 212, 0.2)'
              }}>
                <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>🏆</span>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', margin: 0 }}>
                  {torneos.length === 0 ? "No hay torneos públicos disponibles" : "No se encontró ningún torneo con ese nombre."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
