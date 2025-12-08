package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.DTO.EnfrentamientoDTO;
import com.Robotech.BackEnd_Robotech.DTO.ResultadoEnfrentamientoDTO;
import com.Robotech.BackEnd_Robotech.modelo.Enfrentamiento;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IEnfrentamientoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enfrentamientos")
@CrossOrigin(origins = "*")
public class EnfrentamientoController {

    private final IEnfrentamientoServicio enfrentamientoService;

    @Autowired
    public EnfrentamientoController(IEnfrentamientoServicio enfrentamientoService) {
        this.enfrentamientoService = enfrentamientoService;
    }
    //EndPoint para listar enfrentamientos por torneo
    @GetMapping("/listar/{id}")
    public ResponseEntity<?> listarEnfrentamientosPorTorneo(@PathVariable int id){
        try{
            List<Enfrentamiento> enfrentamientos = enfrentamientoService.obtenerEnfrentamientoPorTorneo(id);
            List<EnfrentamientoDTO> enfrentamientoList = enfrentamientos.stream()
                    .map(enfrentamiento -> new EnfrentamientoDTO(
                            enfrentamiento.getId(),
                            enfrentamiento.getTorneo().getId(),
                            // Verificamos competidor 1 (por seguridad)
                            enfrentamiento.getCompetidor1() != null ? enfrentamiento.getCompetidor1().getApodo() : "Esperando...",
                            (enfrentamiento.getCompetidor1() != null && enfrentamiento.getCompetidor1().getUsuario() != null) ? enfrentamiento.getCompetidor1().getUsuario().getFoto() : "",
                            // Verificamos competidor 2 (por seguridad)
                            enfrentamiento.getCompetidor2() != null ? enfrentamiento.getCompetidor2().getApodo() : "Esperando...",
                            (enfrentamiento.getCompetidor2() != null && enfrentamiento.getCompetidor2().getUsuario() != null) ? enfrentamiento.getCompetidor2().getUsuario().getFoto() : "",
                            enfrentamiento.getPuntaje_1(),
                            enfrentamiento.getPuntaje_2(),
                            // --- AQUÍ ESTABA EL ERROR ---
                            // Si getGanador() no es nulo, obtenemos el apodo. Si es nulo, devolvemos null.
                            enfrentamiento.getGanador() != null ? enfrentamiento.getGanador().getApodo() : null,

                            // Lo mismo para la foto del ganador
                            (enfrentamiento.getGanador() != null && enfrentamiento.getGanador().getUsuario() != null) ? enfrentamiento.getGanador().getUsuario().getFoto() : null,
                            enfrentamiento.getRonda()
                    ))
                    .toList();
            return ResponseEntity.ok(enfrentamientoList);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al listar enfrentamientos: " + e.getMessage());
        }
    }
    // Endpoint para generar los enfrentamientos de un torneo
    @PostMapping("/generar/{torneoId}")
    public ResponseEntity<String> generarEnfrentamientos(@PathVariable int torneoId) {
        try {
            enfrentamientoService.generarEnfrentamientos(torneoId);
            return ResponseEntity.ok("Enfrentamientos generados exitosamente para el torneo con ID " + torneoId);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
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
    @PostMapping("/siguienteRonda/{torneoId}/{rondaActual}")
    public ResponseEntity<String> generarSiguienteRonda(
            @PathVariable int torneoId,
            @PathVariable int rondaActual) {

        try {
            enfrentamientoService.generarSiguienteRonda(torneoId, rondaActual);
            return ResponseEntity.ok("Siguiente ronda generada correctamente para el torneo con ID " + torneoId);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al generar la siguiente ronda: " + e.getMessage());
        }
    }
}
