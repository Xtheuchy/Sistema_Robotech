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

    const slides = [afiche1, afiche2, afiche3, afiche4];

    // Carrusel automático
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [slides.length]);

    // Datos de ejemplo - reemplazar con API
    const competidores = [
        { pos: 1, nombre: "RobotMaster_X", club: "Tech Warriors", puntos: 2450, victorias: 28 },
        { pos: 2, nombre: "CyberBot2000", club: "Digital Ninjas", puntos: 2380, victorias: 25 },
        { pos: 3, nombre: "MechaKnight", club: "Iron Legion", puntos: 2250, victorias: 23 },
        { pos: 4, nombre: "NanoBot_Pro", club: "Future Builders", puntos: 2100, victorias: 20 },
        { pos: 5, nombre: "TitaniumForce", club: "Metal Storm", puntos: 1980, victorias: 18 },
        { pos: 6, nombre: "SparkPlug", club: "Electric Dreams", puntos: 1850, victorias: 16 },
        { pos: 7, nombre: "CircuitBreaker", club: "Tech Warriors", puntos: 1720, victorias: 14 },
        { pos: 8, nombre: "RoboNinja", club: "Shadow Bots", puntos: 1650, victorias: 13 },
        { pos: 9, nombre: "GearMaster", club: "Iron Legion", puntos: 1580, victorias: 12 },
        { pos: 10, nombre: "ByteRunner", club: "Digital Ninjas", puntos: 1500, victorias: 11 },
    ];

    const clubs = [
        { pos: 1, nombre: "Tech Warriors", miembros: 25, puntos: 8500, torneos: 12 },
        { pos: 2, nombre: "Digital Ninjas", miembros: 20, puntos: 7800, torneos: 10 },
        { pos: 3, nombre: "Iron Legion", miembros: 18, puntos: 7200, torneos: 9 },
        { pos: 4, nombre: "Future Builders", miembros: 22, puntos: 6800, torneos: 8 },
        { pos: 5, nombre: "Metal Storm", miembros: 15, puntos: 6200, torneos: 7 },
        { pos: 6, nombre: "Electric Dreams", miembros: 12, puntos: 5600, torneos: 6 },
        { pos: 7, nombre: "Shadow Bots", miembros: 14, puntos: 5100, torneos: 5 },
        { pos: 8, nombre: "Cyber Squad", miembros: 16, puntos: 4800, torneos: 5 },
        { pos: 9, nombre: "Robo Team", miembros: 10, puntos: 4200, torneos: 4 },
        { pos: 10, nombre: "Mecha Force", miembros: 11, puntos: 3900, torneos: 4 },
    ];

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

                    {/* Tabla de Competidores */}
                    {activeTab === "competidores" && (
                        <div className="ranking-table-container animate-fadeIn">
                            <table className="ranking-table">
                                <thead>
                                    <tr>
                                        <th>Pos</th>
                                        <th>Competidor</th>
                                        <th>Club</th>
                                        <th>Puntos</th>
                                        <th>Victorias</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {competidores.map((c) => (
                                        <tr key={c.pos} className={c.pos <= 3 ? `rank-${c.pos}` : ""}>
                                            <td>
                                                <span className="rank-badge">{getMedal(c.pos)}</span>
                                            </td>
                                            <td>{c.nombre}</td>
                                            <td>{c.club}</td>
                                            <td className="points">{c.puntos.toLocaleString()}</td>
                                            <td>{c.victorias}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Tabla de Clubs */}
                    {activeTab === "clubs" && (
                        <div className="ranking-table-container animate-fadeIn">
                            <table className="ranking-table">
                                <thead>
                                    <tr>
                                        <th>Pos</th>
                                        <th>Club</th>
                                        <th>Miembros</th>
                                        <th>Puntos</th>
                                        <th>Torneos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clubs.map((club) => (
                                        <tr key={club.pos} className={club.pos <= 3 ? `rank-${club.pos}` : ""}>
                                            <td>
                                                <span className="rank-badge">{getMedal(club.pos)}</span>
                                            </td>
                                            <td>{club.nombre}</td>
                                            <td>{club.miembros}</td>
                                            <td className="points">{club.puntos.toLocaleString()}</td>
                                            <td>{club.torneos}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="ranking-cta animate-fadeIn">
                        <p>¿Quieres ver tu nombre aquí?</p>
                        <a href="/registro/competidor" className="btn-primary">
                            <span>Regístrate Ahora</span>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Ranking;
