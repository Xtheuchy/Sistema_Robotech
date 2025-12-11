// src/componentes/Layout.jsx
import AsideBar from "../components/AsideBar";
import Header from "../components/Header";

const Layout = ({ children }) => {
    return (
        // contenedor principal que ocupa toda la pantalla sin scroll global
        <div className="flex h-screen overflow-hidden bg-white font-sans">

            {/* barra lateral fija oculta en moviles */}
            <AsideBar className="w-64 shrink-0 hidden md:flex h-full" />

            {/* contenedor derecho para el encabezado y el contenido */}
            <div className="flex-1 flex flex-col h-full min-w-0 bg-white">

                {/* encabezado superior */}
                <Header className="w-full shrink-0" />

                {/* area principal con scroll independiente */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-white">
                    {/* centrador de contenido */}
                    <div className="mx-auto max-w-7xl h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
export default Layout;