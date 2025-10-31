// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
// 1. Crear el Contexto
// Este es el objeto que los componentes "consumirán"
const AuthContext = createContext(null);
// 2. Crear el Proveedor (El componente "cerebro")
export const AuthProvider = ({ children }) => {
  // 3. El estado global que guarda la info del usuario
  const [usuario, setUsuario] = useState(null);

  // Estado de carga para saber si ya revisamos localStorage
  const [cargando, setCargando] = useState(true);
  // 4. Efecto para cargar el usuario desde localStorage al iniciar la app
  useEffect(() => {
    try {
      const usuarioGuardado = localStorage.getItem('usuario');
      if (usuarioGuardado) {
        setUsuario(JSON.parse(usuarioGuardado));
      }
    } catch (error) {
      console.error("Error al cargar usuario de localStorage", error);
      localStorage.removeItem('usuario'); // Limpia si está corrupto
    }
    // Una vez que terminamos de revisar, dejamos de cargar
    setCargando(false); 
  }, []);

  // 5. Función de Login (que usará tu LoginPage)
  const login = (datosUsuario) => {
    // Actualiza el estado global de React
    setUsuario(datosUsuario); 
    // Guarda el usuario en localStorage para persistir la sesión
    localStorage.setItem('usuario', JSON.stringify(datosUsuario)); 
  };

  // 6. Función de Logout (que usará tu Header o AsideBar)
  const logout = () => {
    // Borra el estado global
    setUsuario(null); 
    // Limpia el localStorage
    localStorage.removeItem('usuario'); 
  };
  // 7. Creamos el valor que compartiremos con toda la app
  const valor = {
    usuario, // El objeto del usuario (o null)
    login,
    logout
  };
  
  // 8. Si aún estamos cargando (revisando localStorage), no mostramos nada
  if (cargando) {
    return null;
  }

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return contexto;
};