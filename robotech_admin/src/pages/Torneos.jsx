import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { torneoServicio } from "../service/torneoService";
import TorneoCard from "../components/card/TorneoCard";
import { categoriaServicio } from "../service/categoriaService";
import { sedeServicio } from "../service/sedeService";
const Torneos = () => {
    // Lista de torneos
    const [torneos, setTorneos] = useState([]);
    const [categoria, setCategoria] = useState([]);
    const [sede, setSede] = useState([]);
    const [torneosFiltrados, setTorneosFiltrados] = useState([]);
    //Modal
    const [modalAbierto, setModalAbierto] = useState(false);

    // Funciones para abrir y cerrar el modal
    const abrirModal = () => setModalAbierto(true);

    const cerrarModal = () => {
        setModalAbierto(false);
        setError(null); // Limpia errores
    };

    // Estados de carga y error
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Estado del filtro seleccionado
    const [filtro, setFiltro] = useState('todos');  // Valor por defecto 'todos'
    const [formTorneo, setFormTorneo] = useState({
        id: "",
        categoria: "",
        nombre_torneo: "",
        descripcion_torneo: "",
        foto: "",
        cantidad: 8,
        fecha_inicio: "",
        fecha_final: "",
        estado: "",
        sede: ""
    });

    //Manejador para actualizar el estado del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormTorneo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    //Manejador para enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await torneoServicio.registrarTorneo(formTorneo);
            cargarTorneos()
            cerrarModal();
            return Swal.fire({
                icon: "success",
                title: "¡Torneo Creado!",
                text: "El torneo se ha registrado correctamente.",
                showConfirmButton: true,
            });
        } catch (err) {
            // Muestra el error que viene del backend
            return Swal.fire({
                icon: "error",
                text: err,
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
    };

    const cargarTorneos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await torneoServicio.listarTorneos();
            setTorneos(data);
        } catch (err) {
            setError(err.toString());
        } finally {
            setLoading(false);
        }
    };
    const cargarCategorias = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await categoriaServicio.listarCategorias();
            setCategoria(data);
        } catch (err) {
            setError(err.toString());
        } finally {
            setLoading(false);
        }
    };
    const cargarSedes = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await sedeServicio.listarSedes();
            setSede(data);
        } catch (err) {
            setError(err.toString());
        } finally {
            setLoading(false);
        }
    };
    // Carga inicial
    useEffect(() => {
        cargarTorneos();
        cargarCategorias();
        cargarSedes();
    }, []);
    // Filtrar los torneos según el filtro seleccionado
    useEffect(() => {
        if (filtro === 'todos') {
            setTorneosFiltrados(torneos);
        } else {
            setTorneosFiltrados(torneos.filter(torneo => torneo.estado === filtro));
        }
    }, [filtro, torneos]);
    if (loading) {
        return <p>Cargando torneos...</p>;
    }
    if (error) {
        return <p>Error: {error}</p>;
    }
    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold">Gestión de torneos</h2>
            <nav className="flex justify-between mt-4 mb-4">
                <div className="botones flex gap-2">
                    <button
                        onClick={() => setFiltro('todos')}
                        className="cursor-pointer bg-blue-200 text-black pr-2 pl-2 pt-1 pb-1 rounded-xl hover:text-white hover:bg-blue-800 transition-all"
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFiltro('Borrador')}
                        className="cursor-pointer bg-blue-200 text-black pr-2 pl-2 pt-1 pb-1 rounded-xl hover:text-white hover:bg-blue-800 transition-all"
                    >
                        Borrador
                    </button>
                    <button
                        onClick={() => setFiltro('Publico')}
                        className="cursor-pointer bg-blue-200 text-black pr-2 pl-2 pt-1 pb-1 rounded-xl hover:text-white hover:bg-blue-800 transition-all"
                    >
                        Público
                    </button>
                    <button
                        onClick={() => setFiltro('Finalizado')}
                        className="cursor-pointer bg-blue-200 text-black pr-2 pl-2 pt-1 pb-1 rounded-xl hover:text-white hover:bg-blue-800 transition-all"
                    >
                        Finalizado
                    </button>
                    <button
                        onClick={() => setFiltro('en curso')}
                        className="cursor-pointer bg-blue-200 text-black pr-2 pl-2 pt-1 pb-1 rounded-xl hover:text-white hover:bg-blue-800 transition-all"
                    >
                        En curso
                    </button>
                </div>
                <button
                    onClick={abrirModal}
                    className="cursor-pointer bg-blue-800 text-white pr-2 pl-2 pt-1 pb-1 rounded-xl">
                    Registrar torneo
                </button>
            </nav>
            <main className="flex flex-wrap gap-4">
                {torneosFiltrados.length > 0 ? (
                    torneosFiltrados.map(torneo => (
                        <TorneoCard
                            key={torneo.id}
                            tournament={torneo}
                            cargarTorneo={cargarTorneos}
                        />
                    ))
                ) : (
                    <p>No hay torneos disponibles con este filtro.</p>
                )}
            </main>
            {modalAbierto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" onClick={cerrarModal}>
                    {/* Contenedor del Modal */}
                    <div
                        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* HEADER (Fijo) */}
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <i className="fa-solid fa-trophy text-indigo-600"></i>
                                Registrar Torneo
                            </h2>
                            <button
                                onClick={cerrarModal}
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                            >
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>

                        {/* BODY (Scrollable) */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="editTorneoForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Nombre del Torneo (Full Width) */}
                                <div className="md:col-span-2 space-y-1">
                                    <label htmlFor="nombre_torneo" className="block text-sm font-medium text-gray-700">Nombre del Torneo</label>
                                    <input
                                        type="text"
                                        id="nombre_torneo"
                                        name="nombre_torneo"
                                        value={formTorneo.nombre_torneo}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Ej: Torneo Titanes de Acero"
                                    />
                                </div>

                                {/* Foto URL (Full Width) */}
                                <div className="md:col-span-2 space-y-1">
                                    <label htmlFor="foto" className="block text-sm font-medium text-gray-700">URL de la Foto</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="fa-solid fa-image text-gray-400"></i>
                                        </div>
                                        <input
                                            type="url"
                                            id="foto"
                                            name="foto"
                                            value={formTorneo.foto}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-1">
                                    <label htmlFor="descripcion_torneo" className="block text-sm font-medium text-gray-700">Descripción</label>
                                    <textarea
                                        id="descripcion_torneo"
                                        name="descripcion_torneo"
                                        value={formTorneo.descripcion_torneo}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                                    ></textarea>
                                </div>

                                {/* --- FECHAS --- */}
                                <div className="space-y-1">
                                    <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
                                    <input
                                        type="date"
                                        id="fecha_inicio"
                                        name="fecha_inicio"
                                        value={formTorneo.fecha_inicio.split('T')[0]}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="fecha_final" className="block text-sm font-medium text-gray-700">Fecha Final</label>
                                    <input
                                        type="date"
                                        id="fecha_final"
                                        name="fecha_final"
                                        value={formTorneo.fecha_final.split('T')[0]}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                </div>

                                {/* --- SELECTS (Categoría y Sede) --- */}
                                <div className="space-y-1">
                                    <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
                                    <div className="relative">
                                        <select
                                            id="categoria"
                                            name="categoria"
                                            value={formTorneo.categoria}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white"
                                        >
                                            <option value="" disabled>Seleccionar...</option>
                                            {categoria.map((cat, index) => {
                                                return <option key={index} value={cat.nombre}>{cat.nombre}</option>;
                                            })}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                                            <i className="fa-solid fa-chevron-down text-xs"></i>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="sede" className="block text-sm font-medium text-gray-700">Sede</label>
                                    <div className="relative">
                                        <select
                                            id="sede"
                                            name="sede"
                                            value={formTorneo.sede}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white"
                                        >
                                            <option value="" disabled>Seleccionar...</option>
                                            {sede.map((sed, index) => {
                                                return <option key={index} value={sed.nombreSede}>{sed.nombreSede}</option>;
                                            })}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                                            <i className="fa-solid fa-chevron-down text-xs"></i>
                                        </div>
                                    </div>
                                </div>

                                {/* --- Cantidad --- */}
                                <div className="space-y-1">
                                    <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">Max. Participantes</label>
                                    <select
                                        name="cantidad"
                                        id="cantidad"
                                        value={formTorneo.cantidad}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                                    >
                                        <option value={8}>8 Max.</option>
                                        <option value={16}>16 Max.</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
                                    <select
                                        id="estado"
                                        name="estado"
                                        value={formTorneo.estado}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                                    >
                                        <option value="" disabled>Seleccionar...</option>
                                        <option value="Borrador">borrador</option>
                                        <option value="En Curso">En Curso</option>
                                        <option value="Finalizado">Finalizado</option>
                                    </select>
                                </div>

                                {error && (
                                    <div className="md:col-span-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
                                        <i className="fa-solid fa-circle-exclamation"></i>
                                        {error}
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* FOOTER (Fijo) */}
                        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={cerrarModal}
                                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form="editTorneoForm" // Vincula este botón al form de arriba
                                className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                            >
                                <i className="fa-solid fa-floppy-disk"></i>
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Torneos;