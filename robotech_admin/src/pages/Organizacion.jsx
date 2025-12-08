import Categorias from "../components/Categorias";
import Sede from "../components/Sede";

const Organizacion = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Sede/>
            <Categorias/>
        </div>
    )
}
export default Organizacion;