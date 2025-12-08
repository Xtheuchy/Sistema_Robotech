import AsideBar from "../components/AsideBar";
import Header from "../components/Header";

const Layout = ({children}) =>{
    return(
        <section className="flex h-lvh">
            <AsideBar
            className="w-1/5 h-full bg-gray-100 pr-3 pl-3 border-r border-gray-600"
            />
            <div className="w-4/5 h-full flex flex-col">
                <Header
                className="bg-gray-100 flex justify-between items-center p-2 pr-26 border-b border-gray-600"
                />
                <main className="flex-1 overflow-y-auto p-1">
                    {children}
                </main>
            </div>
        </section>
    )
}
export default Layout;