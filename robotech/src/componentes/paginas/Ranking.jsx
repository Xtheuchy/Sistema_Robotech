import React, { useState, useEffect } from "react";
import "./Paginas.css";

// Imágenes para el carrusel
import afiche1 from "../../assets/imagenes/AFICHE1.png";
import afiche2 from "../../assets/imagenes/AFICHE2.png";
import afiche3 from "../../assets/imagenes/afiche3.png";
import afiche4 from "../../assets/imagenes/afiche4.jpg";

const Ranking = () => {
    const [activeTab, setActiveTab] = useState("competidores");
    const [currentSlide, setCurrentSlide] = useState(0);
    const [competidores, setCompetidores] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Verificar si el usuario ya inició sesión
    const isLoggedIn = localStorage.getItem("usuario") || localStorage.getItem("club") || localStorage.getItem("competidor");

    const slides = [afiche1, afiche2, afiche3, afiche4];

    // Carrusel automático
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [slides.length]);

    // Obtener datos de la API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Obtener competidores
                const competidoresRes = await fetch("http://localhost:8080/api/competidor/listar");
                if (!competidoresRes.ok) throw new Error("Error al obtener competidores");
                const competidoresData = await competidoresRes.json();

                // Ordenar competidores por puntos de mayor a menor
                const competidoresOrdenados = competidoresData
                    .sort((a, b) => b.puntos - a.puntos)
                    .map((c, index) => ({
                        pos: index + 1,
                        nombre: c.apodo,
                        nombreCompleto: c.usuario?.nombres || "Sin nombre",
                        foto: c.usuario?.foto || null,
                        puntos: c.puntos || 0,
                        id: c.id
                    }));
                setCompetidores(competidoresOrdenados);

                // Obtener clubs
                const clubsRes = await fetch("http://localhost:8080/api/club");
                if (!clubsRes.ok) throw new Error("Error al obtener clubs");
                const clubsData = await clubsRes.json();

                // Ordenar clubs por puntos de mayor a menor
                const clubsOrdenados = clubsData
                    .sort((a, b) => b.puntos - a.puntos)
                    .map((club, index) => ({
                        pos: index + 1,
                        nombre: club.clubNombre,
                        propietario: club.propietario,
                        logo: club.logo,
                        puntos: club.puntos || 0,
                        id: club.id
                    }));
                setClubs(clubsOrdenados);

            } catch (err) {
                console.error("Error fetching ranking data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getMedal = (pos) => {
        if (pos === 1) return "🥇";
        if (pos === 2) return "🥈";
        if (pos === 3) return "🥉";
        return pos;
    };

    return (
        <div className="page-wrapper">
            <section className="page-section ranking-page">
                <div className="container">
                    {/* Header */}
                    <div className="section-header animate-fadeIn">
                        <span className="section-badge">Clasificación</span>
                        <h1 className="section-title">
                            Top <span className="text-gradient">Ranking</span>
                        </h1>
                    </div>

                    {/* Carrusel de imágenes */}
                    <div className="carousel-container animate-fadeIn">
                        <div className="carousel">
                            {slides.map((slide, index) => (
                                <div
                                    key={index}
                                    className={`carousel-slide ${index === currentSlide ? "active" : ""}`}
                                >
                                    <img src={slide} alt={`Afiche ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                        <div className="carousel-dots">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    className={`dot ${index === currentSlide ? "active" : ""}`}
                                    onClick={() => setCurrentSlide(index)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="ranking-tabs animate-fadeIn">
                        <button
                            className={`tab-btn ${activeTab === "competidores" ? "active" : ""}`}
                            onClick={() => setActiveTab("competidores")}
                        >
                            🤖 Competidores
                        </button>
                        <button
                            className={`tab-btn ${activeTab === "clubs" ? "active" : ""}`}
                            onClick={() => setActiveTab("clubs")}
                        >
                            🏢 Clubs
                        </button>
                    </div>

                    {/* Estado de carga */}
                    {loading && (
                        <div className="loading-container animate-fadeIn" style={{ textAlign: 'center', padding: '40px' }}>
                            <p style={{ color: '#fff', fontSize: '1.2rem' }}>⏳ Cargando ranking...</p>
                        </div>
                    )}

                    {/* Estado de error */}
                    {error && !loading && (
                        <div className="error-container animate-fadeIn" style={{ textAlign: 'center', padding: '40px' }}>
                            <p style={{ color: '#ff6b6b', fontSize: '1.2rem' }}>❌ Error: {error}</p>
                        </div>
                    )}

                    {/* Tabla de Competidores */}
                    {!loading && !error && activeTab === "competidores" && (
                        <div className="ranking-table-container animate-fadeIn">
                            {competidores.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#aaa', padding: '40px' }}>
                                    No hay competidores registrados aún.
                                </p>
                            ) : (
                                <table className="ranking-table">
                                    <thead>
                                        <tr>
                                            <th>Pos</th>
                                            <th>Foto</th>
                                            <th>Apodo</th>
                                            <th>Nombre</th>
                                            <th>Puntos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {competidores.map((c) => (
                                            <tr key={c.id} className={c.pos <= 3 ? `rank-${c.pos}` : ""}>
                                                <td>
                                                    <span className="rank-badge">{getMedal(c.pos)}</span>
                                                </td>
                                                <td>
                                                    <img
                                                        src={c.foto || 'https://via.placeholder.com/40'}
                                                        alt={c.nombre}
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '50%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                </td>
                                                <td><strong>{c.nombre}</strong></td>
                                                <td>{c.nombreCompleto}</td>
                                                <td className="points">{c.puntos.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* Tabla de Clubs */}
                    {!loading && !error && activeTab === "clubs" && (
                        <div className="ranking-table-container animate-fadeIn">
                            {clubs.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#aaa', padding: '40px' }}>
                                    No hay clubs registrados aún.
                                </p>
                            ) : (
                                <table className="ranking-table">
                                    <thead>
                                        <tr>
                                            <th>Pos</th>
                                            <th>Logo</th>
                                            <th>Club</th>
                                            <th>Propietario</th>
                                            <th>Puntos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clubs.map((club) => (
                                            <tr key={club.id} className={club.pos <= 3 ? `rank-${club.pos}` : ""}>
                                                <td>
                                                    <span className="rank-badge">{getMedal(club.pos)}</span>
                                                </td>
                                                <td>
                                                    <img
                                                        src={club.logo || 'https://via.placeholder.com/40'}
                                                        alt={club.nombre}
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '8px',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                </td>
                                                <td><strong>{club.nombre}</strong></td>
                                                <td>{club.propietario}</td>
                                                <td className="points">{club.puntos.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* CTA - Solo mostrar si no hay sesión iniciada */}
                    {!isLoggedIn && (
                        <div className="ranking-cta animate-fadeIn">
                            <p>¿Quieres ver tu nombre aquí?</p>
                            <a href="/registro/competidor" className="btn-primary">
                                <span>Regístrate Ahora</span>
                            </a>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Ranking;
