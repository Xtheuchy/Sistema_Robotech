const Header = ({className}) => {
    return (
        <header className={className}>
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
            <div className="flex w-55 gap-2">
                <picture>
                    <img 
                    className="w-[50px] h-[50px] rounded-[100%] object-cover"
                    src="https://fotografias.lasexta.com/clipping/cmsimages02/2019/11/14/66C024AF-E20B-49A5-8BC3-A21DD22B96E6/default.jpg?crop=1300,731,x0,y0&width=1280&height=720&optimize=low" 
                    alt="perfil de usuario" />
                </picture>
                <div>
                    <p className="font-medium">Administrador</p>
                    <p className="font-sans text-[14px] font-light">Elvis@gmail.com</p>
                </div>
            </div>
        </header>
    )
}
export default Header;