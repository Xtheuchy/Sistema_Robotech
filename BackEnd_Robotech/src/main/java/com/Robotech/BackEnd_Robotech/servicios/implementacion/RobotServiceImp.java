package com.Robotech.BackEnd_Robotech.servicios.implementacion;

import com.Robotech.BackEnd_Robotech.modelo.Competidor;
import com.Robotech.BackEnd_Robotech.modelo.Robot;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import com.Robotech.BackEnd_Robotech.repositorio.ICompetidorRepositorio;
import com.Robotech.BackEnd_Robotech.repositorio.IRobotRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICompetidorServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IRobotServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RobotServiceImp implements IRobotServicio {
    private IRobotRepositorio robotRepositorio;
    private ICompetidorServicio competidorServicio;
    @Autowired
    public RobotServiceImp(IRobotRepositorio robotRepositorio,ICompetidorServicio competidorServicio){
        this.robotRepositorio = robotRepositorio;
        this.competidorServicio = competidorServicio;
    }
    @Override
    public List<Robot> listarRobots() throws Exception {
        return robotRepositorio.findAll();
    }
    @Override
    public List<Robot> listarPorCompetidor(Competidor competidor) throws Exception {
        return robotRepositorio.findAllByCompetidor(competidor);
    }
    @Override
    public Robot agregarRobot(Robot robot, int id) throws Exception {
        //Buscamos al competidor que agrego al robot
        Competidor competidor = competidorServicio.buscarPorId(id);

        //Asignamos al competidor al robot que añadio
        robot.setCompetidor(competidor);
        return robotRepositorio.save(robot);
    }
    @Override
    public Robot buscarPorId(int id) throws Exception {
        return robotRepositorio.findById(id)
                .orElseThrow(()-> new Exception("¡robot con id "+ id + "no encontrado!"));
    }
    @Override
    public void eliminarPorId(int id) throws Exception {
        robotRepositorio.deleteById(id);
    }
}
