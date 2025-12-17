import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginClub } from "../service/apiService";
import "./Login.css";

const LoginClub = ({ setClubActivo }) => {
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

            const clubData = await loginClub(credenciales);

            // Guardar en localStorage
            localStorage.setItem("clubActivo", JSON.stringify(clubData));
            setClubActivo(clubData);

            // Redirigir al perfil
            navigate("/perfil/club");
        } catch (err) {
            if (err.message.includes("no registrado") || err.message.includes("no existe")) {
                setError("Este club no está registrado. Por favor regístrate primero.");
            } else if (err.message.includes("contraseña") || err.message.includes("password")) {
                setError("Correo o contraseña incorrectos.");
            } else {
                setError(err.message || "Error al iniciar sesión. Verifica tus datos.");
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
                        <span className="login-icon">🏢</span>
                        <h2>Login Club</h2>
                        <p>Ingresa a la cuenta de tu club</p>
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
                                placeholder="correo@club.com"
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
                        <p>
                            ¿No tienes cuenta?{" "}
                            <Link to="/registro/club">Registra tu club aquí</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginClub;
