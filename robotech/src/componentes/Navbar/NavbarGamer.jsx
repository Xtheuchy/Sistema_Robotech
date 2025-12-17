import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavbarGamer.css";
import logo from "../../assets/imagenes/Logo_robotech.png";

const NavbarGamer = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <nav className={`navbar-gamer ${scrolled ? "scrolled" : ""}`}>
                <div className="navbar-container">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        <div className="logo-wrapper">
                            <img src={logo} alt="RoboTech Logo" />
                        </div>
                        <span className="logo-text">
                            <span className="logo-robo">ROBO</span>
                            <span className="logo-tech">TECH</span>
                        </span>
                    </Link>

                    {/* Toggle móvil */}
                    <button
                        className={`mobile-toggle ${mobileMenuOpen ? "active" : ""}`}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    {/* Menú de navegación */}
                    <ul className={`navbar-menu ${mobileMenuOpen ? "active" : ""}`}>
                        <li>
                            <Link
                                to="/"
                                className={`nav-link ${isActive("/") ? "active" : ""}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                🏠 Inicio
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/nosotros"
                                className={`nav-link ${isActive("/nosotros") ? "active" : ""}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                👥 Nosotros
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/informacion"
                                className={`nav-link ${isActive("/informacion") ? "active" : ""}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                📋 Información
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/ranking"
                                className={`nav-link ${isActive("/ranking") ? "active" : ""}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                🏆 Ranking
                            </Link>
                        </li>

                        {/* Login Dropdown - SIN GAP ENTRE BOTÓN Y MENÚ */}
                        <li className="dropdown">
                            <span className="nav-link dropdown-trigger">
                                🔐 Login <span className="arrow">▼</span>
                            </span>
                            <div className="dropdown-content">
                                <Link to="/login/club" onClick={() => setMobileMenuOpen(false)}>
                                    🏢 Club
                                </Link>
                                <Link to="/login/competidor" onClick={() => setMobileMenuOpen(false)}>
                                    🤖 Competidor
                                </Link>
                            </div>
                        </li>

                        {/* Registro Dropdown */}
                        <li className="dropdown">
                            <span className="nav-link dropdown-trigger">
                                📝 Registro <span className="arrow">▼</span>
                            </span>
                            <div className="dropdown-content">
                                <Link to="/registro/club" onClick={() => setMobileMenuOpen(false)}>
                                    🏢 Club
                                </Link>
                                <Link to="/registro/competidor" onClick={() => setMobileMenuOpen(false)}>
                                    🤖 Competidor
                                </Link>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Partículas de fondo */}
            <div className="particles-bg">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
            </div>
        </>
    );
};

export default NavbarGamer;
