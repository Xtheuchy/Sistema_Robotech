package com.Robotech.BackEnd_Robotech.servicios.interfaz;

import com.Robotech.BackEnd_Robotech.DTO.RegistroInscripcionDTO;
import com.Robotech.BackEnd_Robotech.modelo.Inscripcion;

import java.util.List;

public interface IInscripcionServicio {
    public List<Inscripcion> listarInscripcionPorTorneo(int id) throws Exception;
    public Inscripcion agregarInscripcion(RegistroInscripcionDTO inscripcionDTO) throws Exception;
    public void eliminarInscripcionPorId(int id) throws Exception;
}
