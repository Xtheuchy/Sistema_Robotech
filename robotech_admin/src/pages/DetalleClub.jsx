import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { clubServicio } from "../service/clubService";

const DetalleClub = () => {
    const { clubId } = useParams();

    // Estados
    const [club, setClub] = useState(null);
    const [miembros, setMiembros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            try {
                // 1. Obtener datos del club
                const dataClub = await clubServicio.obtenerClubPorId(clubId);
                setClub(dataClub);
                
                // 2. Obtener integrantes
                const dataIntegrantes = await clubServicio.listarIntegrantes(clubId);
                setMiembros(dataIntegrantes); 
            } catch (err) {
                setError("Error al cargar la información del club.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (clubId) {
            cargarDatos();
        }
    }, [clubId]);

    // Función auxiliar para formatear fecha y evitar el error de "un día antes"
    const formatearFecha = (fechaString) => {
        if (!fechaString) return "";
        const fecha = new Date(fechaString);
        // Usamos UTC para asegurar que se muestre el día exacto sin la resta de zona horaria
        return fecha.toLocaleDateString('es-ES', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="text-xl text-gray-600">
                <i className="fa-solid fa-spinner fa-spin mr-2"></i> Cargando detalles...
            </div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <Link to="/clubes" className="block mt-2 underline">Volver</Link>
            </div>
        </div>
    );

    if (!club) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                
                {/* --- Botón Volver --- */}
                <div className="mb-6">
                    <Link to="/clubes" className="text-gray-500 hover:text-gray-800 transition-colors">
                        <i className="fa-solid fa-arrow-left mr-2"></i> Volver a la lista
                    </Link>
                </div>

                {/* --- Tarjeta Principal (Encabezado) --- */}
                <header className="bg-white rounded-xl shadow-md overflow-hidden mb-8 relative">
                    {/* Fondo decorativo superior */}
                    <div className="h-32 bg-linear-to-r from-blue-600 to-indigo-700"></div>
                    
                    <div className="px-6 pb-6">
                        <div className="flex flex-col md:flex-row items-center md:items-end -mt-12 mb-4">
                            {/* Logo del Club */}
                            <img 
                                src={club.logo || "https://via.placeholder.com/150"} 
                                alt="Logo Club" 
                                className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white object-cover"
                            />
                            
                            {/* Info Principal */}
                            <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left flex-1">
                                <h1 className="text-3xl font-bold text-gray-800">{club.clubNombre}</h1>
                                <p className="text-gray-500 text-sm mt-1">
                                    <i className="fa-regular fa-calendar mr-1"></i> 
                                    {/* Usamos la función corregida aquí */}
                                    Creado el {formatearFecha(club.creado_en)}
                                </p>
                            </div>

                            {/* Estado (Badge) */}
                            <div className="mt-4 md:mt-0">
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm
                                    ${club.estado === 'ACTIVO' 
                                        ? 'bg-green-100 text-green-800 border border-green-200' 
                                        : 'bg-red-100 text-red-800 border border-red-200'
                                    }`}>
                                    <i className={`fa-solid ${club.estado === 'ACTIVO' ? 'fa-check-circle' : 'fa-ban'} mr-2`}></i>
                                    {club.estado}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- COLUMNA IZQUIERDA: Detalles y Propietario --- */}
                    <div className="lg:col-span-1 space-y-8">
                        
                        {/* Tarjeta Propietario */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                                <i className="fa-solid fa-user-tie mr-2 text-indigo-600"></i>
                                Propietario
                            </h3>
                            <div className="flex items-center gap-4">
                                <img 
                                    src={club.propietarioFoto || "https://via.placeholder.com/100"} 
                                    alt={club.propietario}
                                    className="w-16 h-16 rounded-full object-cover border border-gray-200"
                                />
                                <div>
                                    <p className="font-bold text-gray-800">{club.propietario}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Administrador</p>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta Contacto */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                                <i className="fa-solid fa-address-card mr-2 text-indigo-600"></i>
                                Información de Contacto
                            </h3>
                            <ul className="space-y-4 text-gray-600">
                                <li className="flex items-start">
                                    <i className="fa-solid fa-envelope w-6 text-center mt-1 mr-2 text-gray-400"></i>
                                    <span className="break-all">{club.correo}</span>
                                </li>
                                <li className="flex items-center">
                                    <i className="fa-solid fa-phone w-6 text-center mr-2 text-gray-400"></i>
                                    <span>{club.telefono}</span>
                                </li>
                                <li className="flex items-start">
                                    <i className="fa-solid fa-location-dot w-6 text-center mt-1 mr-2 text-gray-400"></i>
                                    <span>{club.direccion}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* --- COLUMNA DERECHA: Lista de Miembros --- */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md p-6 min-h-[400px]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="flex gap-2 text-xl font-bold text-gray-800">
                                    <i className="fa-solid fa-users mr-2 text-indigo-600"></i>
                                    Miembros del Club : 
                                    <p className="text-gray-600">{miembros.length}</p>
                                </h3>
                            </div>

                            {/* Tabla de Miembros */}
                            {miembros.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                                        <thead className="uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-4 text-gray-600 font-semibold">Participante</th>
                                                <th scope="col" className="px-6 py-4 text-gray-600 font-semibold">Apodo</th>
                                                <th scope="col" className="px-6 py-4 text-gray-600 font-semibold text-center">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {miembros.map((miembro) => (
                                                <tr key={miembro.id} className="hover:bg-gray-50 transition-colors">
                                                    {/* Columna Nombre + Foto + Correo */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <img 
                                                                className="h-10 w-10 rounded-full object-cover border border-gray-200 mr-3" 
                                                                src={miembro.foto || "https://via.placeholder.com/40"} 
                                                                alt={miembro.nombres} 
                                                            />
                                                            <div>
                                                                <div className="font-medium text-gray-800">{miembro.nombres}</div>
                                                                <div className="text-gray-500 text-xs">{miembro.correo}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Columna Apodo */}
                                                    <td className="px-6 py-4 text-gray-600">
                                                        <span className="bg-gray-100 text-gray-700 py-1 px-3 rounded-md text-xs font-bold">
                                                            {miembro.apodo}
                                                        </span>
                                                    </td>

                                                    {/* Columna Estado */}
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                            ${miembro.estado === 'ACTIVO' 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'}`}>
                                                            {miembro.estado === 'ACTIVO' && <i className="fa-solid fa-circle text-[8px] mr-1.5 text-green-600"></i>}
                                                            {miembro.estado}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                // Estado vacío (Empty State)
                                <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-200 rounded-lg">
                                    <div className="text-gray-300 mb-3 text-4xl">
                                        <i className="fa-solid fa-user-group"></i>
                                    </div>
                                    <p className="text-gray-500 font-medium">Aún no hay miembros en este club.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DetalleClub;