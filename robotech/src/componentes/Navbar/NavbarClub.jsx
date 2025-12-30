import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./NavbarGamer.css";
import logo from "../../assets/imagenes/Logo_robotech.png";

const NavbarClub = ({ setClubActivo }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("clubActivo");
        setClubActivo(null);
        navigate("/");
    };

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

                    {/* Menú */}
                    <ul className={`navbar-menu ${mobileMenuOpen ? "active" : ""}`}>
                        <li>
                            <Link
                                to="/perfil/club"
                                className={`nav-link ${isActive("/perfil/club") ? "active" : ""}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                🏢 Perfil
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

                        <li>
                            <Link
                                to="/torneos"
                                className={`nav-link ${isActive("/torneos") ? "active" : ""}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                🎮 Torneos
                            </Link>
                        </li>

                        <li>
                            <button className="nav-link logout-btn" onClick={handleLogout}>
                                🚪 Cerrar Sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Partículas */}
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

export default NavbarClub;
