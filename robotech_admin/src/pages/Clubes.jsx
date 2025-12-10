import React, { useEffect, useState } from 'react';
import { clubServicio } from '../service/clubService';
import { Link } from 'react-router-dom';

const Clubes = () => {
    const [clubs, setClubs] = useState([]);
    const [activeTab, setActiveTab] = useState('PENDIENTE');
    const [selectedClub, setSelectedClub] = useState(null);

    // Estados para lógica de rechazo
    const [rejectionReason, setRejectionReason] = useState("");
    const [showRejectInput, setShowRejectInput] = useState(false);

    const cargarClubes = async () => {
        try {
            const data = await clubServicio.listarClubes();
            setClubs(data);
        } catch (err) {
            console.log(err.toString());
        }
    };

    useEffect(() => {
        cargarClubes();
    }, []);

    const filteredClubs = clubs.filter(club => club.estado === activeTab);

    // --- CORRECCIÓN DE FECHA ---
    const formatDate = (dateString) => {
        if (!dateString) return "Fecha no disponible";
        const date = new Date(dateString);
        const dateLocal = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return dateLocal.toLocaleDateString('es-ES', options);
    };

    // --- NUEVA LÓGICA DE DECISIÓN CONECTADA AL BACKEND ---
    const handleDecision = async (id, newStatus, reason = "") => {
        try {
            
            // 1. Definir la acción para el Backend ('permitir' o 'rechazar')
            const accionApi = newStatus === 'ACTIVO' ? 'permitir' : 'rechazar';

            // 2. Construir el objeto JSON requerido
            const validacionPayload = {
                id: id,
                accion: accionApi,
                mensaje: reason // Si es aprobar, reason llega vacío por defecto
            };

            // 3. Llamar al servicio
            await clubServicio.validarClub(validacionPayload);

            // 4. Si el backend responde OK, actualizamos el estado local visualmente
            setClubs(prev => prev.map(club =>
                club.id === id ? { ...club, estado: newStatus, motivoRechazo: reason } : club
            ));

            // 5. Cerrar el modal
            closeModal();

        } catch (error) {
            console.error("Error al validar el club:", error);
            alert("Ocurrió un error al procesar la solicitud. Intente nuevamente.");
        }
    };

    const closeModal = () => {
        setSelectedClub(null);
        setRejectionReason("");
        setShowRejectInput(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header Mejorado */}
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Administración de Clubes</h1>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm text-gray-600">
                        <i className="fa-solid fa-calendar-day mr-2 text-blue-500"></i>
                        Hoy: {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </header>

                {/* Tabs de Navegación Estilizados */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-8 inline-flex flex-wrap w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('PENDIENTE')}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'PENDIENTE'
                            ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            }`}
                    >
                        <i className="fa-solid fa-clock-rotate-left"></i>
                        Solicitudes
                        {clubs.filter(c => c.estado === 'PENDIENTE').length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-5 text-center">
                                {clubs.filter(c => c.estado === 'PENDIENTE').length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('ACTIVO')}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'ACTIVO'
                            ? 'bg-green-50 text-green-700 shadow-sm ring-1 ring-green-200'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            }`}
                    >
                        <i className="fa-solid fa-store"></i>
                        Clubes Activos
                    </button>
                </div>

                {/* Grid de Tarjetas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClubs.length > 0 ? (
                        filteredClubs.map((club) => (
                            <div key={club.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">

                                {/* Cuerpo de la tarjeta */}
                                <div className="p-5 flex gap-4 items-start flex-1">
                                    <div className="relative shrink-0">
                                        <img
                                            src={club.logo}
                                            alt="Logo"
                                            className="w-16 h-16 rounded-xl object-cover bg-gray-100 border border-gray-200 shadow-sm"
                                        />
                                        {club.estado === 'PENDIENTE' && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-gray-900 truncate text-lg" title={club.clubNombre}>
                                            {club.clubNombre}
                                        </h3>

                                        <div className="mt-1 flex items-center text-sm text-gray-500 gap-1">
                                            <i className="fa-solid fa-user-circle text-gray-400"></i>
                                            <span className="truncate">{club.propietario}</span>
                                        </div>

                                        <div className="mt-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${club.estado === 'PENDIENTE'
                                                ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                }`}>
                                                {club.estado === 'PENDIENTE'
                                                    ? <><i className="fa-solid fa-hourglass-half"></i> En Revisión</>
                                                    : <><i className="fa-solid fa-check-circle"></i> Activo</>
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Tarjeta */}
                                <div className="bg-gray-50/80 px-5 py-3 border-t border-gray-100 flex justify-between items-center mt-auto">
                                    <span className="text-xs font-medium text-gray-400">
                                        Reg: {formatDate(club.creado_en)}
                                    </span>
                                    {
                                        club.estado === 'PENDIENTE' ?
                                            <button
                                                onClick={() => setSelectedClub(club)}
                                                className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 group"
                                            >
                                                Ver Ficha <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
                                            </button>
                                            :
                                            <Link
                                                to={`/DetalleClub/${club.id}`}
                                                className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 group"
                                            >
                                                Ver detalle <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
                                            </Link>
                                    }

                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                            <div className="bg-gray-50 p-4 rounded-full mb-3">
                                <i className="fa-regular fa-folder-open fa-2x"></i>
                            </div>
                            <p className="font-medium">No hay clubes en esta sección</p>
                        </div>
                    )}
                </div>

                {/* ================= MODAL DE DETALLE ================= */}
                {selectedClub && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in my-8">

                            {/* Header Modal */}
                            <div className="bg-slate-800 text-white p-6 relative">
                                <button
                                    onClick={closeModal}
                                    className="absolute top-4 right-4 text-white/60 hover:text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                                >
                                    <i className="fa-solid fa-xmark text-xl"></i>
                                </button>

                                <div className="flex gap-5 items-center">
                                    <img src={selectedClub.logo} className="w-20 h-20 rounded-xl border-4 border-white/10 object-cover bg-white shadow-lg" alt="Logo" />
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight">{selectedClub.clubNombre}</h2>
                                        <p className="text-slate-300 text-sm flex items-center gap-2 mt-1">
                                            <i className="fa-regular fa-calendar"></i>
                                            Registrado el {formatDate(selectedClub.creado_en)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Columna 1: Info Club */}
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
                                        Datos de la Sede
                                    </h4>
                                    <div className="space-y-5">
                                        <div className="flex gap-4 group">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                                                <i className="fa-solid fa-map-location-dot"></i>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Dirección Fiscal</p>
                                                <p className="text-sm text-gray-800 font-semibold">{selectedClub.direccion}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 group">
                                            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors">
                                                <i className="fa-solid fa-fingerprint"></i>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">ID de Registro</p>
                                                <p className="text-sm text-gray-800 font-mono">#{selectedClub.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Columna 2: Propietario */}
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                                        Responsable Legal
                                    </h4>

                                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200/60">
                                        <img src={selectedClub.propietarioFoto} className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm" alt="Owner" />
                                        <div>
                                            <p className="font-bold text-gray-800">{selectedClub.propietario}</p>
                                            <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold uppercase">Propietario</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <a className="cursor-pointer flex items-center gap-3 text-gray-600 hover:text-blue-600 group transition-colors">
                                            <i className="fa-regular fa-envelope text-gray-400 group-hover:text-blue-500"></i>
                                            <span className="truncate">{selectedClub.correo}</span>
                                        </a>
                                        <a className="cursor-pointer flex items-center gap-3 text-gray-600 hover:text-blue-600 group transition-colors">
                                            <i className="fa-solid fa-phone text-gray-400 group-hover:text-blue-500"></i>
                                            <span>{selectedClub.telefono}</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Acciones */}
                            {selectedClub.estado === 'PENDIENTE' && (
                                <footer className="p-6 bg-gray-50 border-t border-gray-100">
                                    {!showRejectInput ? (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setShowRejectInput(true)}
                                                className="flex-1 border border-red-200 text-red-600 bg-white hover:bg-red-50 hover:border-red-300 py-3 rounded-xl font-bold transition-all"
                                            >
                                                <i className="fa-solid fa-ban mr-2"></i> Rechazar
                                            </button>
                                            <button
                                                onClick={() => handleDecision(selectedClub.id, 'ACTIVO')}
                                                className="flex-2 bg-blue-600 text-white hover:bg-blue-700 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all active:scale-[0.98]"
                                            >
                                                <i className="fa-solid fa-check-double mr-2"></i> Aprobar Solicitud
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="animate-fade-in">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-sm font-bold text-gray-700">Motivo del rechazo <span className="text-red-500">*</span></label>
                                                <button onClick={() => setShowRejectInput(false)} className="text-xs text-gray-500 hover:text-gray-800 underline">Cancelar</button>
                                            </div>
                                            <textarea
                                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none mb-3 shadow-sm"
                                                placeholder="Ej: La documentación del DNI no es legible..."
                                                rows="3"
                                                autoFocus
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                            ></textarea>
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => handleDecision(selectedClub.id, 'RECHAZADO', rejectionReason)}
                                                    disabled={!rejectionReason.trim()}
                                                    className="bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-red-200 transition-all"
                                                >
                                                    Confirmar Rechazo
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </footer>
                            )}

                            {selectedClub.estado === 'ACTIVO' && (
                                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                                    <button onClick={closeModal} className="text-gray-600 hover:bg-gray-200 px-5 py-2.5 rounded-lg font-medium transition-colors">
                                        Cerrar Ventana
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Clubes;