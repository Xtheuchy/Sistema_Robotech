import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login/Auth.css";

const RegistroRobot = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        categoria: "",
        peso: "",
        descripcion: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Simulación - Reemplazar con API real
        setTimeout(() => {
            navigate("/perfil/competidor");
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="auth-page">
            <div className="auth-particles"></div>

            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <span className="auth-icon">⚙️</span>
                        <h2>Registrar Robot</h2>
                        <p>Añade tu robot a la competencia</p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Nombre del Robot</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="MechaKnight 3000"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Categoría</label>
                            <select
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona categoría</option>
                                <option value="sumo">Sumo</option>
                                <option value="sumo-extremo">Sumo Extremo</option>
                                <option value="laberinto">Laberinto</option>
                                <option value="futbol">Fútbol</option>
                                <option value="drones">Drones</option>
                                <option value="rescate">Rescate</option>
                                <option value="batalla-ia">Batalla IA</option>
                                <option value="roborally">RoboRally</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Peso (gramos)</label>
                            <input
                                type="number"
                                name="peso"
                                value={formData.peso}
                                onChange={handleChange}
                                placeholder="500"
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label>Descripción</label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                placeholder="Describe las características de tu robot..."
                                rows="3"
                            ></textarea>
                        </div>

                        <button type="submit" className="btn-auth" disabled={loading}>
                            {loading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                "Registrar Robot"
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            <a href="/perfil/competidor">← Volver al perfil</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistroRobot;
