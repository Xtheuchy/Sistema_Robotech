package com.Robotech.BackEnd_Robotech.servicios.interfaz;

import com.Robotech.BackEnd_Robotech.DTO.CompetidorDTO;
import com.Robotech.BackEnd_Robotech.modelo.Competidor;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;

import java.util.List;

public interface ICompetidorServicio {
    public Competidor modificarCompetidor(CompetidorDTO competidorDTO) throws Exception;
    public List<Competidor> listarCompetidor() throws Exception;
    public Competidor registrarCompetidor(Competidor competidor) throws Exception;
    public void eliminarPorId(int id) throws Exception;
    public Competidor buscarPorId(int id) throws Exception;
    public boolean verificarApodo(String apodo) throws Exception;
    public Competidor buscarCompetidorPorUsuario(Usuario usuario) throws Exception;
    public List<CompetidorDTO> listarCompetidorPorClub(int id) throws Exception;
    public void modificarPuntoDeCompetidor(Competidor competidor, int cantidad) throws Exception;
}
