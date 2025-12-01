package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.modelo.Categoria;
import com.Robotech.BackEnd_Robotech.modelo.Competidor;
import com.Robotech.BackEnd_Robotech.DTO.RegistroRobotDTO;
import com.Robotech.BackEnd_Robotech.modelo.Robot;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICategoriaServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICompetidorServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IRobotServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/robot")
@CrossOrigin(origins = "*")
public class RobotController {
    private final IRobotServicio robotService;
    private final ICompetidorServicio competidorService;
    private final ICategoriaServicio categoriaService;
    private List<Robot> robots;
    private Robot robot;
    @Autowired
    public RobotController(IRobotServicio robotService,ICompetidorServicio competidorService,ICategoriaServicio categoriaService){
        this.robotService = robotService;
        this.competidorService = competidorService;
        this.categoriaService = categoriaService;
    }

    @GetMapping
    public ResponseEntity<List<Robot>> listarRobots() throws Exception {
        robots = robotService.listarRobots();
        return ResponseEntity.ok(robots);
    }
    @GetMapping("/{id}")
    public ResponseEntity<List<Robot>> listarRobotPorCompetidor(@PathVariable int id) throws Exception{
        Competidor competidor = competidorService.buscarPorId(id);
        robots = robotService.listarPorCompetidor(competidor);
        return ResponseEntity.ok(robots);
    }
    @PostMapping("/registrar/{id}")
    public ResponseEntity<?> agregarRobot(@PathVariable int id, @RequestBody RegistroRobotDTO registroRobotDTO) throws Exception {
        Categoria categoria = categoriaService.buscarPorNombre(registroRobotDTO.getCategoria());
        robot = new Robot(
                registroRobotDTO.getNombre(),
                registroRobotDTO.getFoto(),
                categoria);
        robot = robotService.agregarRobot(robot,id);
        return ResponseEntity.ok(robot);
    }

}
