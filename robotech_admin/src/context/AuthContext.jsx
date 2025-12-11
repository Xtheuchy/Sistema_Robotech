import React, { createContext, useState, useContext, useEffect } from 'react';

// crea el contexto vacio
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // estado global para guardar la info del usuario
  const [usuario, setUsuario] = useState(null);

  // estado para saber si estamos revisando el almacenamiento local
  const [cargando, setCargando] = useState(true);

  // al iniciar la app revisa si hay una sesion guardada
  useEffect(() => {
    try {
      const usuarioGuardado = localStorage.getItem('usuario');
      if (usuarioGuardado) {
        setUsuario(JSON.parse(usuarioGuardado));
      }
    } catch (error) {
      console.error("Error al cargar usuario de localStorage", error);
      localStorage.removeItem('usuario'); // limpia si los datos estan corruptos
    } finally {
      // termina la carga independientemente del resultado
      setCargando(false);
    }
  }, []);

  // funcion para iniciar sesion y persistir datos
  const login = (datosUsuario) => {
    setUsuario(datosUsuario); 
    localStorage.setItem('usuario', JSON.stringify(datosUsuario)); 
  };

  // funcion para cerrar sesion y limpiar datos
  const logout = () => {
    setUsuario(null); 
    localStorage.removeItem('usuario'); 
  };

  // objeto con los valores que se compartiran
  const valor = {
    usuario,
    login,
    logout
  };
  
  // si esta cargando no muestra la app para evitar parpadeos
  if (cargando) {
    return null; // aqui podrias retornar un <LoadingSpinner /> si quisieras
  }

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
};

// hook personalizado para consumir el contexto facilmente
export const useAuth = () => {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return contexto;
};