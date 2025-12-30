package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.modelo.Categoria;
import com.Robotech.BackEnd_Robotech.modelo.Competidor;
import com.Robotech.BackEnd_Robotech.DTO.RegistroRobotDTO;
import com.Robotech.BackEnd_Robotech.modelo.Robot;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICategoriaServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICompetidorServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IRobotServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<?> listarRobots() throws Exception {
        try{
            robots = robotService.listarRobots();
            return ResponseEntity.ok(robots);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> listarRobotPorCompetidor(@PathVariable int id) throws Exception{
        try{
            Competidor competidor = competidorService.buscarPorId(id);
            robots = robotService.listarPorCompetidor(competidor);
            return ResponseEntity.ok(robots);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/registrar/{id}")
    public ResponseEntity<?> agregarRobot(@PathVariable int id, @RequestBody RegistroRobotDTO registroRobotDTO) throws Exception {
        try{
            Categoria categoria = categoriaService.buscarPorNombre(registroRobotDTO.getCategoria());
            robot = new Robot(
                    registroRobotDTO.getNombre(),
                    registroRobotDTO.getFoto(),
                    categoria);
            robot = robotService.agregarRobot(robot,id);
            return ResponseEntity.ok(robot);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarRobot(@PathVariable int id){
        try {
            robotService.eliminarPorId(id);
            return ResponseEntity.ok("Correctamente eliminado!!");
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    //Modificar robot
    @PutMapping("/modificar")
    public ResponseEntity<?> modificarRobot(@RequestBody RegistroRobotDTO registroRobotDTO){
        try {
            return ResponseEntity.ok(robotService.modificarRobot(registroRobotDTO));
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
