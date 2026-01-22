import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { torneoServicio } from "../service/torneoService";
import TorneoCard from "../components/card/TorneoCard";
import { categoriaServicio } from "../service/categoriaService";
import { sedeServicio } from "../service/sedeService";
import { usuarioServicio } from '../service/userService';
import { useAuth } from "../context/AuthContext";

const Torneos = () => {
    //Obtenemos al usuario para listar por rol
    const { usuario } = useAuth();
    // estados para almacenar la informacion traida de la bd
    const [torneos, setTorneos] = useState([]);
    const [categoria, setCategoria] = useState([]);
    const [sede, setSede] = useState([]);
    const [jueces, setJueces] = useState([]);

    // estado para manejar la lista que se muestra en pantalla segun el filtro
    const [torneosFiltrados, setTorneosFiltrados] = useState([]);

    // controla la visibilidad del modal de registro
    const [modalAbierto, setModalAbierto] = useState(false);

    // obtiene la fecha de hoy para validar los inputs de fecha
    const today = new Date().toISOString().split('T')[0];

    const abrirModal = () => setModalAbierto(true);

    const cerrarModal = () => {
        setModalAbierto(false);
        setError(null);
    };

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todos');

    // estado inicial del formulario vacio
    const [formTorneo, setFormTorneo] = useState({
        id: "",
        categoria: "",
        nombre_torneo: "",
        descripcion_torneo: "",
        foto: "",
        cantidad: 8,
        fecha_inicio: "",
        fecha_final: "",
        estado: "Borrador",
        sede: "",
        correoJuez: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormTorneo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // envia los datos al backend para crear el nuevo torneo
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await torneoServicio.registrarTorneo(formTorneo);
            cargarTorneos();
            cerrarModal();
            // Limpiar el formulario para próximos registros
            setFormTorneo({
                id: "",
                categoria: "",
                nombre_torneo: "",
                descripcion_torneo: "",
                foto: "",
                cantidad: 8,
                fecha_inicio: "",
                fecha_final: "",
                estado: "",
                sede: "",
                correoJuez: ""
            });
            return Swal.fire({
                icon: "success",
                title: "¡Torneo Creado!",
                text: "El torneo se ha registrado correctamente.",
                showConfirmButton: true,
            });
        } catch (err) {
            return Swal.fire({
                icon: "error",
                text: err,
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
    };

    // funcion asincrona para obtener la lista de torneos
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

    // funciones auxiliares para llenar los selects del formulario
    const cargarCategorias = async () => { try { const data = await categoriaServicio.listarCategorias(); setCategoria(data); } catch (err) { console.error(err) } };
    const cargarSedes = async () => { try { const data = await sedeServicio.listarSedes(); setSede(data); } catch (err) { console.error(err) } };
    const cargarJueces = async () => { try { const data = await usuarioServicio.listarJueces(); setJueces(data); } catch (err) { console.error(err) } };

    // al ingresar a la pagina carga todos los datos necesarios
    useEffect(() => {
        cargarTorneos();
        cargarCategorias();
        cargarSedes();
        cargarJueces();
    }, []);

    // actualiza la lista visual cada vez que cambia el filtro seleccionado
    useEffect(() => {
        // Verificar si el usuario es JUEZ
        const esJuez = usuario?.rol?.toUpperCase() === 'JUEZ';

        // Primero filtrar por rol (juez solo ve sus torneos asignados)
        const torneosBase = esJuez
            ? torneos.filter(t => t.correoJuez === usuario.correo)
            : torneos;

        // Luego aplicar el filtro de estado
        if (filtro === 'todos') {
            setTorneosFiltrados(torneosBase);
        } else {
            setTorneosFiltrados(torneosBase.filter(torneo => torneo.estado === filtro));
        }
    }, [filtro, torneos, usuario]);

    if (loading && torneos.length === 0) return <p>Cargando torneos...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <section className="p-2">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestión de torneos</h1>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm text-gray-600">
                    <i className="fa-solid fa-calendar-day mr-2 text-blue-500"></i>
                    Hoy: {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </header>

            {/* navegacion para filtrar estados */}
            <nav className="flex justify-between mt-4 mb-4">
                <div className="botones flex gap-2">
                    {['todos', 'Borrador', 'Publico', 'Finalizado', 'en curso'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFiltro(f)}
                            className="cursor-pointer bg-blue-200 text-black px-2 py-1 rounded-xl hover:text-white hover:bg-blue-800 transition-all capitalize"
                        >
                            {f}
                        </button>
                    ))}
                </div>
                {usuario.rol === 'Administrador' && (
                    <button
                        onClick={abrirModal}
                        className="cursor-pointer bg-blue-800 text-white px-3 py-1 rounded-xl">
                        Registrar torneo
                    </button>
                )}
            </nav>

            {/* area principal donde se renderizan las tarjetas */}
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

            {/* modal flotante para el registro */}
            {modalAbierto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" onClick={cerrarModal}>
                    <article
                        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all"
                        onClick={e => e.stopPropagation()}
                    >
                        <header className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <i className="fa-solid fa-trophy text-indigo-600"></i>
                                Registrar Torneo
                            </h2>
                            <button onClick={cerrarModal} className="text-gray-400 hover:text-red-500 hover:bg-red-50 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200">
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </header>

                        <section className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="editTorneoForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div className="md:col-span-2 space-y-1">
                                    <label htmlFor="nombre_torneo" className="block text-sm font-medium text-gray-700">Nombre del Torneo</label>
                                    <input type="text" id="nombre_torneo" name="nombre_torneo" value={formTorneo.nombre_torneo} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Ej: Torneo Titanes de Acero" />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label htmlFor="foto" className="block text-sm font-medium text-gray-700">URL de la Foto</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><i className="fa-solid fa-image text-gray-400"></i></span>
                                        <input type="url" id="foto" name="foto" value={formTorneo.foto} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="https://..." />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label htmlFor="descripcion_torneo" className="block text-sm font-medium text-gray-700">Descripción</label>
                                    <textarea id="descripcion_torneo" name="descripcion_torneo" value={formTorneo.descripcion_torneo} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"></textarea>
                                </div>

                                {/* agrupacion de fechas */}
                                <fieldset className="contents">
                                    <div className="space-y-1">
                                        <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
                                        <input
                                            type="date"
                                            id="fecha_inicio"
                                            name="fecha_inicio"
                                            min={today}
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
                                            min={formTorneo.fecha_inicio ? formTorneo.fecha_inicio.split('T')[0] : today}
                                            value={formTorneo.fecha_final.split('T')[0]}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                </fieldset>

                                <div className="space-y-1">
                                    <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
                                    <div className="relative">
                                        <select id="categoria" name="categoria" value={formTorneo.categoria} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white">
                                            <option value="" disabled>Seleccionar...</option>
                                            {categoria.map((cat, index) => <option key={index} value={cat.nombre}>{cat.nombre}</option>)}
                                        </select>
                                        <span className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500"><i className="fa-solid fa-chevron-down text-xs"></i></span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="sede" className="block text-sm font-medium text-gray-700">Sede</label>
                                    <div className="relative">
                                        <select id="sede" name="sede" value={formTorneo.sede} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white">
                                            <option value="" disabled>Seleccionar...</option>
                                            {sede.map((sed, index) => <option key={index} value={sed.nombreSede}>{sed.nombreSede}</option>)}
                                        </select>
                                        <span className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500"><i className="fa-solid fa-chevron-down text-xs"></i></span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="juez" className="block text-sm font-medium text-gray-700">Juez Principal</label>
                                    <div className="relative">
                                        <select
                                            id="juez"
                                            name="correoJuez"
                                            value={formTorneo.correoJuez}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white"
                                        >
                                            <option value="" disabled>Seleccionar Juez...</option>
                                            {jueces.map((juez) => (
                                                <option key={juez.id} value={juez.j_correo}>
                                                    {juez.j_nombre}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                                            <i className="fa-solid fa-chevron-down text-xs"></i>
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">Max. Participantes</label>
                                    <select name="cantidad" id="cantidad" value={formTorneo.cantidad} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
                                        <option value={8}>8 Max.</option>
                                        <option value={16}>16 Max.</option>
                                    </select>
                                </div>

                                <div className="space-y-1 md:col-span-2">
                                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
                                    <select id="estado" name="estado" value={formTorneo.estado} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
                                        <option value="Borrador">Borrador</option>
                                    </select>
                                </div>
                            </form>
                        </section>
                        <footer className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button type="button" onClick={cerrarModal} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors">Cancelar</button>
                            <button type="submit" form="editTorneoForm" className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                                <i className="fa-solid fa-plus"></i> Registrar Torneo
                            </button>
                        </footer>
                    </article>
                </div>
            )}
        </section>
    );
}
export default Torneos;