import { useEffect, useState } from "react";
import { torneoServicio } from "../service/torneoService";
const Torneos = () => {
    //Lista de torneos
    const [torneosPublicos, setTorneosPublicos] = useState([]);

    //Estados de carga y error
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const cargarTorneosPublicos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await torneoServicio.listarTorneoPublico();
            setTorneosPublicos(data);
        } catch (err) {
            setError(err.toString());
        } finally {
            setLoading(false);
        }
    };
    // Carga inicial
    useEffect(() => {
        cargarTorneosPublicos();
    }, []);

    if (loading) {
        return <p>Cargando torneos...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <>
            <header className="flex justify-between bg-gray-100 rounded-[5px] p-2">
                <h2 className=" text-2xl font-bold">Torneos</h2>
                <button className="bg-blue-500 cursor-pointer hover:scale-105 transition-all p-2 rounded-[5px] font-mono text-white">Agregar torneo</button>
            </header>
            {
                torneosPublicos && torneosPublicos.length > 0 ? (
                    torneosPublicos.map((torneo) => (
                        <li key={torneo.id}>
                            {torneo.nombre} - {torneo.estado}
                        </li>
                    ))
                ) : (
                    "No hay torneos publicos"
                )
            }
        </>
    )
}
export default Torneos;