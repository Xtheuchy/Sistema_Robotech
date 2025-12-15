package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.DTO.InscripcionDTO;
import com.Robotech.BackEnd_Robotech.DTO.RegistroInscripcionDTO;
import com.Robotech.BackEnd_Robotech.modelo.*;
import com.Robotech.BackEnd_Robotech.repositorio.IInscripcionRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICompetidorServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IInscripcionServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IRobotServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ITorneoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/inscripcion")
@CrossOrigin(origins = "*")
public class InscripcionController {
    private final IInscripcionServicio inscripcionServicio;
    private final ICompetidorServicio competidorServicio;
    private final IRobotServicio robotServicio;
    private final ITorneoServicio torneoServicio;
    private final IInscripcionRepositorio inscripcionRepositorio;
    @Autowired
    public InscripcionController(IInscripcionRepositorio inscripcionRepositorio,ITorneoServicio torneoServicio,IInscripcionServicio inscripcionServicio,ICompetidorServicio competidorServicio,IRobotServicio robotServicio){
        this.inscripcionServicio = inscripcionServicio;
        this.competidorServicio = competidorServicio;
        this.robotServicio = robotServicio;
        this.torneoServicio = torneoServicio;
        this.inscripcionRepositorio = inscripcionRepositorio;
    }

    //Listar inscripcion por torneo
    @GetMapping("/{id}")
    public ResponseEntity<?> listarInscripcionPorTorneo(@PathVariable int id) throws Exception {
        try {
            List<Inscripcion> inscripcions = inscripcionServicio.listarInscripcionPorTorneo(id);
            List<InscripcionDTO> inscripcionDTOs = inscripcions.stream()
                    .map(inscripcion -> new InscripcionDTO(
                            inscripcion.getId(),
                            inscripcion.getCompetidor().getApodo(),
                            inscripcion.getCompetidor().getUsuario().getCorreo()
                    ))
                    .toList();
            return ResponseEntity.ok(inscripcionDTOs);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    //Registrar Inscripciones
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarInscripcion(@RequestBody RegistroInscripcionDTO inscripcionDTO) {
        try {
            // 1. Obtener las entidades
            Competidor competidor = competidorServicio.buscarPorId(inscripcionDTO.getCompetidorId());
            Torneo torneo = torneoServicio.obtenerPorId(inscripcionDTO.getTorneoId());
            List<Robot> robots = robotServicio.listarPorCompetidor(competidor);
            List<Inscripcion> inscripcions = inscripcionRepositorio.findAlldByTorneo(torneo);

            //2. Validación : verifica si el competidor ya esta inscrito en el torneo
            boolean competidorInscrito = inscripcions.stream()
                    .anyMatch(inscripcion -> inscripcion.getCompetidor().getId() == (competidor.getId()));
            if (competidorInscrito){
                throw new Exception("El competidor ya se encuentra inscrito en este torneo.");
            }

            // 3. Obtener la categoría requerida por el torneo
            Categoria categoriaTorneo = torneo.getCategoria();

            // 4. Validación : Verificar si el competidor tiene un robot de esa categoría
            // Recorremos la lista de robots y buscamos si alguno coincide
            boolean tieneRobotValido = robots.stream()
                    .anyMatch(robot -> robot.getCategoria().getId() == (categoriaTorneo.getId()));
            // 5. Si no tiene robot válido, lanzamos error o retornamos Bad Request
            if (!tieneRobotValido) {
                return new ResponseEntity<>(
                        "El competidor no posee ningún robot registrado para la categoría: " + categoriaTorneo.getNombre(),
                        HttpStatus.BAD_REQUEST
                );
            }
            // 6. Si pasa la validación, procedemos a inscribir
            return ResponseEntity.ok(inscripcionServicio.agregarInscripcion(inscripcionDTO));

        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
