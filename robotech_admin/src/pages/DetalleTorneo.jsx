import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { torneoServicio } from "../service/torneoService";
import { inscripcionServicio } from "../service/inscripcionService";
import { enfrentamientoServicio } from "../service/enfrentamientoService";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

const DetalleTorneo = () => {
    //Obtener al usuario que inicio sesion 
    const { usuario } = useAuth();
    // obtenemos el id de la url
    const { id } = useParams();

    // estados para manejar la data del torneo y la ui
    const [torneo, setTorneo] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [inscritos, setInscritos] = useState([]);

    // genera los cruces del torneo mediante el servicio
    const generarEnfrentamiento = async (id) => {
        try {
            const data = await enfrentamientoServicio.generarEnfrentamiento(id);
            return Swal.fire({
                text: data,
                icon: "success",
                draggable: true
            });
        } catch (err) {
            return Swal.fire({
                text: err,
                icon: "error",
                draggable: true
            });
        }
    };

    // trae la lista de participantes inscritos
    const cargarInscripciones = async () => {
        try {
            setError(null);
            const data = await inscripcionServicio.listarInscripcionPorTorneo(id);
            setInscritos(data);
        } catch (err) {
            return Swal.fire({
                icon: "error",
                text: err,
                showConfirmButton: false,
            });
        }
    };

    // carga las inscripciones al montar el componente
    useEffect(() => {
        cargarInscripciones();
    }, []);

    // obtiene toda la info del torneo cuando cambia el id
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setCargando(true);
                const data = await torneoServicio.obtenerTorneoPorId(id);

                // inicializo vacio si el backend no manda la lista para evitar errores
                if (!data.inscritos) data.inscritos = [];

                setTorneo(data);
            } catch (err) {
                console.error(err);
                setError("No se pudo cargar la información del torneo.");
            } finally {
                setCargando(false);
            }
        };

        if (id) {
            cargarDatos();
        }
    }, [id]);

    // helper para los colores segun el estado
    const getStatusColor = (estado) => {
        switch (estado) {
            case 'En Curso': return 'bg-emerald-500 text-white border-emerald-600';
            case 'Finalizado': return 'bg-slate-600 text-white border-slate-700';
            default: return 'bg-blue-600 text-white border-blue-700';
        }
    };

    // muestra el spinner mientras carga los datos
    if (cargando) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <i className="fa-solid fa-circle-notch fa-spin text-4xl text-blue-600"></i>
                    <p className="text-slate-500 font-medium">Cargando datos del torneo...</p>
                </div>
            </div>
        );
    }

    // muestra el mensaje de error si falla algo
    if (error || !torneo) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <i className="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-4"></i>
                    <h2 className="text-xl font-bold text-slate-800">Hubo un problema</h2>
                    <p className="text-slate-500 mb-6">{error || "Torneo no encontrado"}</p>
                    <Link to="/torneos" className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900">
                        Volver a la lista
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-100 p-6 md:p-10 font-sans text-slate-800">

            {/* navegacion superior para volver */}
            <nav className="max-w-7xl mx-auto mb-6 flex justify-between items-end">
                <Link to="/torneos" className="inline-flex items-center text-slate-500 hover:text-blue-700 transition-colors font-medium">
                    <i className="fa-solid fa-arrow-left mr-2"></i>
                    Volver al panel
                </Link>
                <span className="text-xs font-mono text-slate-400 bg-slate-200 px-2 py-1 rounded">
                    ID: {torneo.id}
                </span>
            </nav>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* columna izquierda con detalles principales */}
                <section className="lg:col-span-2 space-y-8">

                    {/* cabecera visual del torneo */}
                    <header className="relative rounded-2xl overflow-hidden shadow-lg group h-80 bg-slate-900">
                        <img
                            src={torneo.fotoTorneo}
                            alt="Torneo Cover"
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to from-slate-900 via-transparent to-transparent"></div>

                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border ${getStatusColor(torneo.estado)}`}>
                                    {torneo.estado}
                                </span>
                                <span className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md border border-white/30">
                                    <i className="fa-solid fa-robot mr-2"></i>
                                    {torneo.nombreCategoria}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
                                {torneo.nombreTorneo}
                            </h1>

                            <div className="mt-4 flex items-center gap-2 text-slate-300 text-sm font-medium">
                                <i className="fa-solid fa-calendar-day text-blue-400"></i>
                                <span>{torneo.fechaInicio}</span>
                                <span className="mx-2">•</span>
                                <i className="fa-solid fa-map-location-dot text-blue-400"></i>
                                <span>{torneo.nombreSede}</span>
                            </div>
                        </div>
                    </header>

                    {/* barra de acciones rapidas */}
                    <section className="flex flex-col sm:flex-row gap-4">
                        {
                            usuario.rol === "Juez" && <button
                                onClick={() => generarEnfrentamiento(torneo.id)}
                                className="cursor-pointer flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                                <i className="fa-solid fa-microchip"></i>
                                Generar Bracket
                            </button>
                        }

                        <Link
                            to={`/TorneoBracket/${torneo.id}`}
                            className="flex-1 py-3 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-bold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2">
                            <i className="fa-solid fa-diagram-project"></i>
                            Ver Esquema
                        </Link>
                    </section>

                    {/* descripcion y contenido textual */}
                    <article className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <i className="fa-solid fa-file-contract text-blue-500"></i>
                            Detalles y Premios
                        </h3>

                        <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-line">
                            {torneo.descripcionTorneo}
                        </div>
                    </article>

                </section>

                {/* columna derecha barra lateral */}
                <aside className="space-y-6">

                    {/* tarjeta del juez */}
                    <article className="bg-slate-800 rounded-xl p-1 shadow-lg">
                        <div className="bg-slate-900 rounded-lg p-5 border border-slate-700/50 relative overflow-hidden">
                            <i className="fa-solid fa-scale-balanced absolute -right-5 -bottom-5 text-8xl text-slate-800 opacity-50"></i>

                            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Juez de torneo</h4>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-xl text-blue-400 border border-slate-600">
                                    <i className="fa-solid fa-user-astronaut"></i>
                                </div>
                                <div>
                                    <p className="text-white font-bold text-lg">Ing. {torneo.nombreJuez}</p>
                                    <p className="text-slate-400 text-xs">{torneo.correoJuez}</p>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* lista de inscritos */}
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px]">

                        <header className="p-5 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <i className="fa-solid fa-users-gear text-blue-600"></i>
                                    Participantes
                                </h3>
                                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {inscritos.length} / {torneo.cantidadParticipantes}
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                                <div
                                    className="bg-blue-600 h-1.5 rounded-full"
                                    style={{ width: `${(inscritos.length / torneo.cantidadParticipantes) * 100}%` }}
                                ></div>
                            </div>
                        </header>

                        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                            {inscritos.map((inscrito) => (
                                <div key={inscrito.id} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <i className="fa-solid fa-robot"></i>
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800 text-sm group-hover:text-blue-700">{inscrito.apodo}</p>
                                        <p className="text-xs text-slate-500 font-medium">{inscrito.correo}</p>
                                    </div>
                                </div>
                            ))}

                            {/* espacios vacios si faltan participantes */}
                            {Array.from({ length: Math.max(0, torneo.cantidadParticipantes - inscritos.length) }).map((_, idx) => (
                                <div key={`empty-${idx}`} className="p-3 rounded-xl border border-dashed border-slate-300 flex items-center justify-center gap-2 text-slate-400 text-xs font-medium bg-slate-50/50">
                                    <i className="fa-regular fa-square-plus"></i> Espacio Disponible
                                </div>
                            ))}
                        </div>
                    </section>

                </aside>
            </div>
        </main>
    );
}
export default DetalleTorneo;