package com.Robotech.BackEnd_Robotech.servicios.interfaz;

import com.Robotech.BackEnd_Robotech.DTO.RegistroTorneoDTO;
import com.Robotech.BackEnd_Robotech.modelo.Torneo;

import java.util.List;

public interface ITorneoServicio {
    public List<Torneo> listarTorneos() throws Exception;
    public List<Torneo> listarTorneosPublicos() throws Exception;
    public List<Torneo> listarTorneosBorrador() throws Exception;
    public Torneo agregarTorneo(Torneo torneo) throws Exception;
    public Torneo modificarTorneo(RegistroTorneoDTO torneoDTO) throws Exception;
    public Torneo modificarEstado(int id, String nuevoEstado) throws Exception;
    public void eliminarPorId(int id) throws Exception;
    public Torneo obtenerPorId(int id) throws Exception;
}
