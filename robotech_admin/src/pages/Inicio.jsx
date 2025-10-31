const Inicio = () => {
    return (
        <div className=" flex justify-around">
            <div className=" bg-gray-100 p-2 rounded-sm border-2 border-gray-200">
                <p>Torneos Activos</p>
                <h2>0</h2>
            </div>

            <div className=" bg-gray-100 p-2 rounded-sm border-2 border-gray-200">
                <p>Clubes Registrados</p>
                <h2>0</h2>
            </div>

            <div className=" bg-gray-100 p-2 rounded-sm border-2 border-gray-200">
                <p>Usuarios Totales</p>
                <h2>0</h2>
            </div>
        </div>
    );
}
export default Inicio;