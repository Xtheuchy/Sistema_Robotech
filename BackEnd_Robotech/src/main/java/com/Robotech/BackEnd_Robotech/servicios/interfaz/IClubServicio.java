package com.Robotech.BackEnd_Robotech.servicios.interfaz;

import com.Robotech.BackEnd_Robotech.DTO.RegistroClubDTO;
import com.Robotech.BackEnd_Robotech.modelo.Club;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;

import java.util.List;

public interface IClubServicio {
    public List<Club> listarClubes() throws Exception;
    public Club registrarClub(RegistroClubDTO registroClubDTO, Usuario usuario) throws Exception;
    public void eliminarPorId (int id) throws Exception;
    public Club buscarPorID(int id) throws Exception;
    public Club modificarClub(Club club) throws Exception;
}
