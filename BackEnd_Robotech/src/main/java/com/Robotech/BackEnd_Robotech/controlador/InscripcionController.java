package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.DTO.RegistroInscripcionDTO;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IInscripcionServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            return ResponseEntity.ok(inscripcionServicio.listarInscripcionPorTorneo(id));
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
