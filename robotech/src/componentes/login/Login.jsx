import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginCliente, obtenerClubPorPropietario } from "../../api";
import "./Login.css";
import "./Login.css";

/**
 * Login Unificado para Competidores y Dueños de Club
 * Redirige según el rol del usuario:
 * - "Competidor" → /perfil/competidor
 * - "Dueño de club" → /perfil/club
 */
const Login = ({ setCompetidorActivo, setClubActivo }) => {
    const [formData, setFormData] = useState({
        correo: "",
        contrasena: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.correo.trim() || !formData.contrasena.trim()) {
            setError("Por favor completa todos los campos");
            return;
        }

        setLoading(true);

        try {
            const credenciales = {
                correo: formData.correo,
                password: formData.contrasena,
            };

            const usuarioData = await loginCliente(credenciales);

            // Verificar el rol y redirigir apropiadamente
            if (usuarioData.rol && usuarioData.rol.toLowerCase() === "dueño de club") {
                // Es dueño de club: Obtener datos del club
                try {
                    const clubData = await obtenerClubPorPropietario(usuarioData.id);
                    localStorage.setItem("clubActivo", JSON.stringify(clubData));
                    localStorage.setItem("propietarioData", JSON.stringify(usuarioData));
                    setClubActivo(clubData);
                    navigate("/perfil/club");
                } catch (clubError) {
                    console.error("Error obteniendo club del dueño:", clubError);
                    // Fallback: guardar usuario como propietario, pero sin clubActivo completo
                    // O mostrar error de que no tiene club
                    setError("Error cargando perfil del club. Intenta nuevamente.");
                }
            } else if (usuarioData.rol && usuarioData.rol.toLowerCase() === "competidor") {
                // Es competidor
                localStorage.setItem("UsuarioData", JSON.stringify(usuarioData));
                setCompetidorActivo(usuarioData);
                navigate("/perfil/competidor");
            } else {
                // Rol no reconocido, asumimos competidor si tiene apodo
                if (usuarioData.apodo) {
                    localStorage.setItem("UsuarioData", JSON.stringify(usuarioData));
                    setCompetidorActivo(usuarioData);
                    navigate("/perfil/competidor");
                } else {
                    // Fallback para roles no claros pero que parecen club
                    try {
                        const clubData = await obtenerClubPorPropietario(usuarioData.id);
                        localStorage.setItem("clubActivo", JSON.stringify(clubData));
                        setClubActivo(clubData);
                        navigate("/perfil/club");
                    } catch (e) {
                        // Si falla, quizás es un admin o un error
                        localStorage.setItem("clubActivo", JSON.stringify(usuarioData));
                        setClubActivo(usuarioData);
                        navigate("/perfil/club");
                    }
                }
            }
        } catch (err) {
            // Manejar errores del servidor
            const errorMessage = err.response?.data || err.message;

            if (typeof errorMessage === 'string') {
                if (errorMessage.includes("no encontrado") || errorMessage.includes("no existe")) {
                    setError("Usuario no encontrado. Por favor regístrate primero.");
                } else if (errorMessage.includes("Contraseña incorrecta") || errorMessage.includes("password")) {
                    setError("Contraseña incorrecta.");
                } else if (errorMessage.includes("no está activa") || errorMessage.includes("rechazada")) {
                    setError(errorMessage);
                } else if (errorMessage.includes("restringido")) {
                    setError("Acceso denegado. Esta área es solo para competidores y clubes.");
                } else {
                    setError(errorMessage);
                }
            } else {
                setError("Error al iniciar sesión. Verifica tus datos.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <span className="login-icon">🎮</span>
                        <h2>Iniciar Sesión</h2>
                        <p>Accede como competidor o club</p>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                placeholder="correo@ejemplo.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                name="contrasena"
                                value={formData.contrasena}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                "Iniciar Sesión"
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>¿No tienes cuenta?</p>
                        <div className="register-links">
                            <Link to="/registro/competidor" className="register-link">
                                🤖 Registrar Competidor
                            </Link>
                            <Link to="/registro/club" className="register-link">
                                🏢 Registrar Club
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
