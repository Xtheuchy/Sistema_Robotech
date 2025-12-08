package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.DTO.InscripcionDTO;
import com.Robotech.BackEnd_Robotech.DTO.RegistroInscripcionDTO;
import com.Robotech.BackEnd_Robotech.DTO.TorneoDTO;
import com.Robotech.BackEnd_Robotech.modelo.Inscripcion;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IInscripcionServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/inscripcion")
@CrossOrigin(origins = "*")
public class InscripcionController {
    @Autowired
    IInscripcionServicio inscripcionServicio;

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
    public ResponseEntity<?> registrarInscripcion(@RequestBody RegistroInscripcionDTO inscripcionDTO){
        try {
            return ResponseEntity.ok(inscripcionServicio.agregarInscripcion(inscripcionDTO));
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
