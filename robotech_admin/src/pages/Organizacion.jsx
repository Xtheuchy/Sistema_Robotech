import Categorias from "../components/Categorias";
import Sede from "../components/Sede";

const Organizacion = () => {
    return (
        <>
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Organización</h1>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm text-gray-600">
                    <i className="fa-solid fa-calendar-day mr-2 text-blue-500"></i>
                    Hoy: {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <Sede />
                <Categorias />
            </div>
        </>
)
        
}
export default Organizacion;