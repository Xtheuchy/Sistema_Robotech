package com.Robotech.BackEnd_Robotech.servicios.interfaz;

import com.Robotech.BackEnd_Robotech.modelo.Club;

import java.util.List;

public interface IClubServicio {
    public List<Club> listarClubes() throws Exception;
    public Club registrarClub(Club club) throws Exception;
    public void eliminarPorId (int id) throws Exception;
    public Club buscarPorID(int id) throws Exception;
}
