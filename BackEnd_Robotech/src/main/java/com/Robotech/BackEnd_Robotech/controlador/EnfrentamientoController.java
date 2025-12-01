package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.DTO.ResultadoEnfrentamientoDTO;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IEnfrentamientoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/enfrentamientos")
@CrossOrigin(origins = "*")
public class EnfrentamientoController {

    private final IEnfrentamientoServicio enfrentamientoService;

    @Autowired
    public EnfrentamientoController(IEnfrentamientoServicio enfrentamientoService) {
        this.enfrentamientoService = enfrentamientoService;
    }

    // Endpoint para generar los enfrentamientos de un torneo
    @PostMapping("/generar/{torneoId}")
    public ResponseEntity<String> generarEnfrentamientos(@PathVariable int torneoId) {
        try {
            enfrentamientoService.generarEnfrentamientos(torneoId);
            return ResponseEntity.ok("Enfrentamientos generados exitosamente para el torneo con ID " + torneoId);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al generar enfrentamientos: " + e.getMessage());
        }
    }

    // Endpoint para registrar los resultados de un enfrentamiento
    @PostMapping("/resultado/{enfrentamientoId}")
    public ResponseEntity<String> registrarResultadoEnfrentamiento(@PathVariable int enfrentamientoId, @RequestBody ResultadoEnfrentamientoDTO enfrentamientoDTO) {
        int puntaje1 = enfrentamientoDTO.getPuntaje1();
        int puntaje2 = enfrentamientoDTO.getPuntaje2();

        try {
            enfrentamientoService.registrarResultadoEnfrentamiento(enfrentamientoId, puntaje1, puntaje2);
            return ResponseEntity.ok("Resultado registrado correctamente para el enfrentamiento con ID " + enfrentamientoId);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al registrar el resultado: " + e.getMessage());
        }
    }

    // Endpoint para generar la siguiente ronda de enfrentamientos
    @PostMapping("/siguienteRonda/{torneoId}")
    public ResponseEntity<String> generarSiguienteRonda(
            @PathVariable int torneoId,
            @RequestParam int rondaActual) {

        try {
            enfrentamientoService.generarSiguienteRonda(torneoId, rondaActual);
            return ResponseEntity.ok("Siguiente ronda generada correctamente para el torneo con ID " + torneoId);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al generar la siguiente ronda: " + e.getMessage());
        }
    }
}
