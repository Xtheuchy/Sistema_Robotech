const Footer = () => {
    return (
        <footer className="bg-[#00A5D9] pr-5 pl-5 text-gray-700 font-bold">
            {/* LOS CAMBIOS CLAVE:
                1. "flex-col": Apila las secciones en vertical (móvil) por defecto.
                2. "gap-8": Añade espacio entre las secciones cuando están apiladas.
                3. "md:flex-row": Vuelve a ponerlas en fila en pantallas medianas o más grandes.
                4. "md:justify-between": Aplica el espaciado solo en pantallas medianas o más grandes.
            */}
            <div className="flex flex-col md:flex-row md:justify-between gap-8">

                {/* "w-50" no es una clase estándar de Tailwind.
                La eliminé para que el contenedor flex controle el ancho automáticamente.
                */}
                <section>
                    <h2>Robotech</h2>
                    <p>El futuro de los combates</p>
                </section>

                <nav>
                    <h2>Enlaces: </h2>
                    <ul>
                        <li>Términos de Servicio</li>
                        <li>Politica de Privacidad</li>
                        <li>Contacto</li>
                    </ul>
                </nav>

                <section>
                    <h2>Síguenos: </h2>
                    <ul className="flex gap-4">
                        {/* Corrección de React: 
                        Cambié "class" por "className" en los íconos.
                        */}
                        <li><a href="#"><i className="fa-brands fa-facebook text-black"></i></a></li>
                        <li><a href="#"><i className="fa-brands fa-youtube text-black"></i></a></li>
                        <li><a href="#"><i className="fa-brands fa-twitter text-black"></i></a></li>
                    </ul>
                </section>
            </div>

            {/* Esta parte ya era responsiva, solo ajusté el padding
                en el contenedor principal.
            */}
            <div className="text-center text-gray-700 border-t border-gray-700 mt-8 pt-6 pb-6">
                <p>&copy; {new Date().getFullYear()} Robotech - Todos los derechos reservados.</p>
            </div>
        </footer>
    )
}
export default Footer;