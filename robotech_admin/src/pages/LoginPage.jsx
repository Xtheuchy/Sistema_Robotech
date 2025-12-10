// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginServicio } from '../service/authService';

function LoginPage() {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const credencialesDTO = { correo, password };
            const usuarioData = await loginServicio(credencialesDTO);
            const rolUsuario = usuarioData.rol.toUpperCase();
            
            if (rolUsuario !== 'ADMINISTRADOR' && rolUsuario !== 'JUEZ') {
                setError("Acceso denegado. Solo administradores y jueces pueden ingresar.");
                setLoading(false);
                return;
            }
            
            login(usuarioData);
            navigate('/');
        } catch (err) {
            setError(err.message || "Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl">
                
                {/* Header del Formulario */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4 shadow-sm">
                        <i className="fa-solid fa-robot text-3xl"></i>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        ROBOTECH
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Portal de Administración y Jueces
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Input Correo */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Correo Electrónico
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fa-solid fa-envelope text-gray-400"></i>
                            </div>
                            <input
                                type="email"
                                id="email"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                                placeholder="ejemplo@robotech.com"
                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Input Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                            Contraseña
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fa-solid fa-lock text-gray-400"></i>
                            </div>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Mensaje de Error */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-pulse">
                            <div className="flex">
                                <div className="shrink-0">
                                    <i className="fa-solid fa-circle-exclamation text-red-500"></i>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700 font-medium">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Botón Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-white shadow-md transition-all duration-200
                        ${loading 
                            ? 'bg-blue-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                    >
                        {loading ? (
                            <>
                                <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>
                                Verificando...
                            </>
                        ) : (
                            <>
                                Ingresar al Sistema
                                <i className="fa-solid fa-right-to-bracket ml-2"></i>
                            </>
                        )}
                    </button>
                </form>
                
                {/* Footer simple (opcional) */}
                <div className="mt-6 text-center text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} Robotech Systems. Todos los derechos reservados.
                </div>
            </div>
        </div>
    );
}

export default LoginPage;