import React from 'react';
import { Link } from 'react-router-dom';

const Inicio = () => {
    // Datos estáticos simulados
    const stats = {
        torneosActivos: 3,
        clubesRegistrados: 12,
        usuariosTotales: 145,
        competidores: 89
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* 1. HEADER DE BIENVENIDA */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            ¡Hola, Administrador! <span className="text-2xl">👋</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Aquí tienes un resumen de lo que pasa en Robotech hoy.</p>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-gray-700">
                            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tarjeta 1: Torneos */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                            <i className="fa-solid fa-trophy"></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Torneos Activos</p>
                            <h2 className="text-3xl font-bold text-gray-800">{stats.torneosActivos}</h2>
                        </div>
                    </div>

                    {/* Tarjeta 2: Clubes */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
                            <i className="fa-solid fa-shield-halved"></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Clubes Registrados</p>
                            <h2 className="text-3xl font-bold text-gray-800">{stats.clubesRegistrados}</h2>
                        </div>
                    </div>

                    {/* Tarjeta 3: Usuarios/Competidores */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-2xl">
                            <i className="fa-solid fa-users"></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Usuarios Totales</p>
                            <h2 className="text-3xl font-bold text-gray-800">{stats.usuariosTotales}</h2>
                        </div>
                    </div>
                </div>

                {/* 3. SECCIÓN MIXTA: Accesos Rápidos + Actividad Reciente */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* A. Accesos Rápidos (Ocupa 2 columnas en pantallas grandes) */}
                    <section className="lg:col-span-2 space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <i className="fa-solid fa-rocket text-blue-500"></i> Accesos Rápidos
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Botón 1 */}
                            <Link to="/torneos" className="group bg-linear-to-br from-blue-500 to-blue-600 text-white p-5 rounded-xl shadow-lg hover:shadow-blue-200 hover:-translate-y-1 transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                        <i className="fa-solid fa-plus text-lg"></i>
                                    </div>
                                    <i className="fa-solid fa-arrow-right opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                </div>
                                <h4 className="mt-4 font-bold text-lg">Crear Nuevo Torneo</h4>
                                <p className="text-blue-100 text-sm">Configurar llaves y fechas</p>
                            </Link>

                            {/* Botón 2 */}
                            <Link to="/clubes" className="group bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-amber-50 text-amber-600 w-10 h-10 rounded-lg flex items-center justify-center">
                                        <i className="fa-solid fa-clipboard-check text-lg"></i>
                                    </div>
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg">Validar Solicitudes</h4>
                                <p className="text-gray-500 text-sm">Revisar clubes pendientes</p>
                            </Link>

                            {/* Botón 3 */}
                            <Link to="/usuarios" className="group bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-indigo-50 text-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
                                        <i className="fa-solid fa-user-plus text-lg"></i>
                                    </div>
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg">Registrar usuario</h4>
                                <p className="text-gray-500 text-sm">Añadir manualmente</p>
                            </Link>

                            {/* Botón 4 */}
                            <div className="group bg-gray-100 border border-gray-200 p-5 rounded-xl flex flex-col justify-center items-center text-center cursor-not-allowed opacity-70">
                                <div className="bg-gray-200 text-gray-400 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                                    <i className="fa-solid fa-chart-pie text-lg"></i>
                                </div>
                                <h4 className="font-bold text-gray-500">Reportes</h4>
                                <p className="text-xs text-gray-400">Próximamente</p>
                            </div>
                        </div>
                    </section>
                    {/* B. OPCIÓN 3: Video Real Embebido */}
                    <section className="flex flex-col h-full">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
                            <i className="fa-brands fa-youtube text-red-600"></i> Video Destacado
                        </h3>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1">
                            <iframe 
                            className='w-full h-full min-h-[250px]' 
                            src="https://www.youtube.com/embed/s-3YeyWtMgI?si=NJwxgBHjPVhx7zRY"></iframe>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Inicio;