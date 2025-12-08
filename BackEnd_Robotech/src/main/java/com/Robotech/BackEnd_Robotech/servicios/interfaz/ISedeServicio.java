package com.Robotech.BackEnd_Robotech.servicios.interfaz;

import com.Robotech.BackEnd_Robotech.modelo.Sede;

import java.util.List;

public interface ISedeServicio {
    public List<Sede> listarSedes() throws Exception;
    public Sede agregarSede(Sede sede) throws Exception;
    public void eliminarPorId(int id) throws Exception;
    public boolean verificarNombreSede(String sede) throws Exception;
    public Sede buscarPorNombre(String nombre) throws Exception;
    public Sede modificarSede(Sede sede) throws Exception;
    public Sede buscarPorId(int id) throws Exception;
}
