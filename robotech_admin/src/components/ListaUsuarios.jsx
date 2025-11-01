// src/componentes/ListaUsuarios.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { usuarioServicio } from '../service/userService';
import BotonAgregarUsuario from './BotonAgregarUsuario';
import BtnEditarUsuario from './BtnEditarUsuario';
function ListaUsuarios() {
    // 1. Estado para la lista original
    const [usuariosOriginales, setUsuariosOriginales] = useState([]);

    // 2. Estados para los filtros
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [filtroRol, setFiltroRol] = useState('TODOS'); // 'TODOS' será el valor por defecto

    // 3. Estados de carga y error
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
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

    // Carga inicial
    useEffect(() => {
        cargarUsuarios();
    }, []);

    // 4. Derivar la lista de roles únicos para el <select>
    // useMemo asegura que esto solo se recalcule si 'usuariosOriginales' cambia
    const rolesUnicos = useMemo(() => {
        const roles = new Set(usuariosOriginales.map(user => user.rol));
        return ['TODOS', ...roles]; // Creamos un array con 'TODOS' al inicio
    }, [usuariosOriginales]);

    const handleEliminar = async (id, nombre) => {
        // Pedimos confirmación
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
    // 5. Derivar la lista filtrada
    // useMemo recalcula esto solo si la lista original o los filtros cambian
    const usuariosFiltrados = useMemo(() => {

        let usuariosTemp = [...usuariosOriginales];

        // Aplicar filtro de Rol
        if (filtroRol !== 'TODOS') {
            usuariosTemp = usuariosTemp.filter(user => user.rol === filtroRol);
        }

        // Aplicar filtro de Búsqueda (en nombres, correo o DNI)
        if (terminoBusqueda.trim() !== '') {
            const busquedaLower = terminoBusqueda.toLowerCase();
            usuariosTemp = usuariosTemp.filter(user =>
                user.nombres.toLowerCase().includes(busquedaLower) ||
                user.correo.toLowerCase().includes(busquedaLower) ||
                (user.dni && user.dni.toLowerCase().includes(busquedaLower)) // Verificamos si DNI existe
            );
        }
        return usuariosTemp;

    }, [usuariosOriginales, filtroRol, terminoBusqueda]);

    // --- Renderizado ---

    if (loading) return <div>Cargando...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div>
            {/* --- CONTROLES DE FILTRO --- */}
            <div className='w-full flex justify-between items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
                {/* Filtro de Búsqueda */}
                <div className='flex items-center border-2 border-gray-300 rounded-lg bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200'>
                    <label htmlFor="busqueda" className="text-sm font-medium text-gray-700 pl-3" style={{ marginRight: '10px' }}>Buscar:</label>
                    <input
                        id="busqueda"
                        type="text"
                        placeholder="Por nombre, correo, DNI.."
                        value={terminoBusqueda}
                        onChange={(e) => setTerminoBusqueda(e.target.value)}
                        className='w-96 focus:outline-none py-2 pr-3 rounded-r-lg'
                    />
                </div>

                {/* Filtro de Rol */}
                <div className="flex items-center gap-2">
                    <label htmlFor="filtroRol" className="text-sm font-medium text-gray-700" style={{ marginRight: '10px' }}>Rol:</label>
                    <select
                        id="filtroRol"
                        value={filtroRol}
                        onChange={(e) => setFiltroRol(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        style={{ padding: '8px' }}
                    >
                        {rolesUnicos.map(rol => (
                            <option key={rol} value={rol}>
                                {rol}
                            </option>
                        ))}
                    </select>
                </div>

                <BotonAgregarUsuario enUsuarioAgregado={cargarUsuarios} />
            </div>

            {/* --- LISTA DE USUARIOS FILTRADA --- */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre completo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* ¡Importante! Mapeamos sobre 'usuariosFiltrados', no 'usuariosOriginales' */}
                        {usuariosFiltrados.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nombres}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.correo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.dni}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {user.rol}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-1">
                                    <BtnEditarUsuario
                                        usuario={user}
                                        onUsuarioActualizado={cargarUsuarios}
                                    />
                                    <button
                                        className="boton-accion editar bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded-md text-sm transition-colors duration-200 shadow-sm hover:shadow-md"
                                        onClick={() => handleEliminar(user.id, user.nombres)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mensaje por si no hay resultados */}
            {usuariosFiltrados.length === 0 && !loading && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-lg font-medium">No se encontraron usuarios que coincidan con los filtros.</p>
                </div>
            )}
        </div>
    );
}

export default ListaUsuarios;