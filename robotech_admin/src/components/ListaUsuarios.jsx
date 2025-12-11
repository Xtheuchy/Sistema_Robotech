// src/componentes/ListaUsuarios.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { usuarioServicio } from '../service/userService';
import BotonAgregarUsuario from './BotonAgregarUsuario';
import BtnEditarUsuario from './BtnEditarUsuario';

function ListaUsuarios() {
    // estado para guardar todos los usuarios que vienen del backend
    const [usuariosOriginales, setUsuariosOriginales] = useState([]);

    // estados para manejar la busqueda y el filtro de rol
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [filtroRol, setFiltroRol] = useState('TODOS');

    // estados para controlar la carga y errores
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // trae la lista de usuarios desde la base de datos
    const cargarUsuarios = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await usuarioServicio.listarUsuarios();
            setUsuariosOriginales(data);
        } catch (err) {
            setError(err.toString());
        } finally {
            setLoading(false);
        }
    };

    // al montar el componente carga los datos necesarios
    useEffect(() => {
        cargarUsuarios();
    }, []);

    // extrae los roles unicos para llenar el select
    const rolesUnicos = useMemo(() => {
        const roles = new Set(usuariosOriginales.map(user => user.rol));
        return ['TODOS', ...roles];
    }, [usuariosOriginales]);

    // elimina al usuario despues de confirmar
    const handleEliminar = async (id, nombre) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar a ${nombre}?`)) {
            try {
                await usuarioServicio.eliminarUsuario(id);
                alert('Usuario eliminado correctamente');
                await cargarUsuarios();
            } catch (err) {
                setError(err.toString());
                alert(`Error al eliminar usuario: ${err.toString()}`);
            }
        }
    };

    // filtra la lista en tiempo real segun lo que escriba el usuario
    const usuariosFiltrados = useMemo(() => {
        let usuariosTemp = [...usuariosOriginales];

        if (filtroRol !== 'TODOS') {
            usuariosTemp = usuariosTemp.filter(user => user.rol === filtroRol);
        }

        if (terminoBusqueda.trim() !== '') {
            const busquedaLower = terminoBusqueda.toLowerCase();
            usuariosTemp = usuariosTemp.filter(user =>
                user.nombres.toLowerCase().includes(busquedaLower) ||
                user.correo.toLowerCase().includes(busquedaLower) ||
                (user.dni && user.dni.toLowerCase().includes(busquedaLower))
            );
        }
        return usuariosTemp;

    }, [usuariosOriginales, filtroRol, terminoBusqueda]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-blue-600 font-medium">Cargando usuarios...</span>
        </div>
    );

    if (error) return (
        <div className="mx-auto max-w-4xl mt-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r shadow-sm">
            <div className="flex">
                <div className="shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-red-700">Error: {error}</p>
                </div>
            </div>
        </div>
    );

    return (
        <main className=" mx-auto px-4 sm:px-6 lg:px-8">

            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestión de usuarios</h1>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm text-gray-600">
                    <i className="fa-solid fa-calendar-day mr-2 text-blue-500"></i>
                    Hoy: {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </header>

            {/* seccion de filtros y controles */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 transition-shadow hover:shadow-md">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">

                    <div className="flex flex-col md:flex-row gap-4 grow">
                        {/* filtro de busqueda */}
                        <div className="grow max-w-md">
                            <label htmlFor="busqueda" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                Buscar Usuario
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    id="busqueda"
                                    type="text"
                                    placeholder="Nombre, correo o DNI..."
                                    value={terminoBusqueda}
                                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* filtro de rol */}
                        <div className="w-full md:w-64">
                            <label htmlFor="filtroRol" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                Filtrar por Rol
                            </label>
                            <div className="relative">
                                <select
                                    id="filtroRol"
                                    value={filtroRol}
                                    onChange={(e) => setFiltroRol(e.target.value)}
                                    className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-gray-50 focus:bg-white transition-all cursor-pointer appearance-none"
                                >
                                    {rolesUnicos.map(rol => (
                                        <option key={rol} value={rol}>
                                            {rol === 'TODOS' ? 'Todos los roles' : rol}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* boton para agregar usuario */}
                    <div className="shrink-0">
                        <BotonAgregarUsuario enUsuarioAgregado={cargarUsuarios} />
                    </div>
                </div>
            </section>

            {/* tabla de resultados */}
            <section className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Documento
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Rol
                                </th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {usuariosFiltrados.map(user => (
                                <tr key={user.id} className="hover:bg-blue-50/40 transition-colors duration-200 group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="shrink-0 h-10 w-10 bg-linear-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                                                {user.nombres.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900">{user.nombres}</div>
                                                <div className="text-sm text-gray-500">{user.correo}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700 font-medium font-mono bg-gray-100 inline-block px-2 py-0.5 rounded border border-gray-200">
                                            {user.dni || 'S/D'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.rol === 'ADMIN'
                                            ? 'bg-purple-100 text-purple-800 border-purple-200'
                                            : 'bg-blue-100 text-blue-800 border-blue-200'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${user.rol === 'ADMIN' ? 'bg-purple-400' : 'bg-blue-400'
                                                }`}></span>
                                            {user.rol}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end items-center gap-3">
                                            <BtnEditarUsuario
                                                usuario={user}
                                                onUsuarioActualizado={cargarUsuarios}
                                            />
                                            <button
                                                onClick={() => handleEliminar(user.id, user.nombres)}
                                                className="cursor-pointer group/btn relative p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                title="Eliminar usuario"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* mensaje si no hay resultados */}
                {usuariosFiltrados.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No se encontraron resultados</h3>
                        <p className="mt-1 text-gray-500 max-w-sm">
                            No hay usuarios que coincidan con "{terminoBusqueda}" o el filtro seleccionado.
                        </p>
                        <button
                            onClick={() => { setTerminoBusqueda(''); setFiltroRol('TODOS'); }}
                            className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}
            </section>

            <footer className="mt-4 text-right">
                <p className="text-xs text-gray-400">Total mostrados: {usuariosFiltrados.length}</p>
            </footer>
        </main>
    );
}

export default ListaUsuarios;