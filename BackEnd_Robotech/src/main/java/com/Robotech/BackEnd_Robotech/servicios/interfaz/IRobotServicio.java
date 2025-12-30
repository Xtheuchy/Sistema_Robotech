package com.Robotech.BackEnd_Robotech.servicios.interfaz;

import com.Robotech.BackEnd_Robotech.DTO.RegistroRobotDTO;
import com.Robotech.BackEnd_Robotech.modelo.Competidor;
import com.Robotech.BackEnd_Robotech.modelo.Robot;

import java.util.List;

public interface IRobotServicio {
    public List<Robot> listarRobots() throws Exception;
    public List<Robot> listarPorCompetidor(Competidor competidor) throws Exception;
    public Robot agregarRobot(Robot robot, int id) throws Exception;
    public Robot buscarPorId(int id) throws Exception;
    public void eliminarPorId(int id) throws Exception;
    public Robot modificarRobot(RegistroRobotDTO registroRobotDTO) throws Exception;
}
