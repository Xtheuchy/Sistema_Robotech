package com.Robotech.BackEnd_Robotech.servicios.interfaz;

import com.Robotech.BackEnd_Robotech.modelo.Rol;

import java.util.List;

public interface IRolServicio{
    public List<Rol> listarRoles() throws Exception;
    public Rol agregarRol(Rol rol) throws Exception;
    public Rol obtenerPorNombre(String nombre) throws Exception;
}
