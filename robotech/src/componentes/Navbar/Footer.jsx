import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer-gamer">
            <div className="footer-particles"></div>

            <div className="footer-container">
                <div className="footer-grid">
                    {/* Logo y descripción */}
                    <div className="footer-brand">
                        <h3 className="footer-logo">
                            <span className="text-gradient">ROBO</span>
                            <span className="text-accent">TECH</span>
                        </h3>
                        <p className="footer-description">
                            El torneo de robótica más emocionante. Donde la tecnología
                            y la creatividad se fusionan para crear el futuro.
                        </p>
                        <div className="footer-social">
                            <a href="#" className="social-link" aria-label="Facebook">
                                <span>📘</span>
                            </a>
                            <a href="#" className="social-link" aria-label="Instagram">
                                <span>📸</span>
                            </a>
                            <a href="#" className="social-link" aria-label="YouTube">
                                <span>▶️</span>
                            </a>
                            <a href="#" className="social-link" aria-label="Discord">
                                <span>🎮</span>
                            </a>
                        </div>
                    </div>

                    {/* Enlaces rápidos */}
                    <div className="footer-links">
                        <h4 className="footer-title">Enlaces</h4>
                        <ul>
                            <li><Link to="/">Inicio</Link></li>
                            <li><Link to="/nosotros">Nosotros</Link></li>
                            <li><Link to="/informacion">Información</Link></li>
                            <li><Link to="/ranking">Ranking</Link></li>
                        </ul>
                    </div>

                    {/* Categorías */}
                    <div className="footer-links">
                        <h4 className="footer-title">Categorías</h4>
                        <ul>
                            <li><a href="#">Sumo</a></li>
                            <li><a href="#">Laberinto</a></li>
                            <li><a href="#">Fútbol</a></li>
                            <li><a href="#">Rescate</a></li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div className="footer-contact">
                        <h4 className="footer-title">Contacto</h4>
                        <p>📧 info@robotech.com</p>
                        <p>📱 +1 234 567 890</p>
                        <p>📍 Arena Digital, Ciudad Tech</p>
                    </div>
                </div>

                {/* Copyright */}
                <div className="footer-bottom">
                    <div className="footer-line"></div>
                    <p>
                        © {new Date().getFullYear()} <span className="text-gradient">RoboTech</span>.
                        Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
