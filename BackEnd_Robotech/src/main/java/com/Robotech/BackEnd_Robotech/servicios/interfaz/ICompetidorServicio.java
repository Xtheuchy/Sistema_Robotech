package com.Robotech.BackEnd_Robotech.servicios.interfaz;

import com.Robotech.BackEnd_Robotech.modelo.Competidor;

import java.util.List;

public interface ICompetidorServicio {
    public List<Competidor> listarCompetidor() throws Exception;
    public Competidor registrarCompetidor(Competidor competidor) throws Exception;
    public void eliminarPorId(int id) throws Exception;
    public Competidor buscarPorId(int id) throws Exception;
    public boolean verificarApodo(String apodo) throws Exception;
}
