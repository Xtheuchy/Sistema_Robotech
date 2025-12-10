// src/componentes/Layout.jsx
import AsideBar from "../components/AsideBar";
import Header from "../components/Header";

const Layout = ({ children }) => {
    return (
        // Contenedor principal: h-screen para ocupar toda la ventana y sin scroll en el body
        <section className="flex h-screen overflow-hidden bg-white font-sans">

            {/* ASIDEBAR: 
              - Usamos w-64 (256px) fijo para consistencia visual (mejor que porcentajes).
              - flex-shrink-0 evita que se encoja si la pantalla es pequeña.
              - El color de fondo ya lo maneja el componente internamente (bg-gray-50).
            */}
            <AsideBar className="w-64 shrink-0 hidden md:flex h-full" />

            {/* CONTENEDOR DERECHO (Header + Main) */}
            <div className="flex-1 flex flex-col h-full min-w-0 bg-white">

                {/* HEADER: El estilo visual ya viene dentro del componente */}
                <Header className="w-full shrink-0" />

                {/* MAIN: 
                  - overflow-y-auto: El scroll ocurre solo aquí, no en toda la página.
                  - p-8: Espaciado generoso alrededor del contenido.
                */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-white">
                    {/* Centrador opcional para pantallas muy anchas */}
                    <div className="mx-auto max-w-7xl h-full">
                        {children}
                    </div>
                </main>
            </div>
        </section>
    );
}

export default Layout;