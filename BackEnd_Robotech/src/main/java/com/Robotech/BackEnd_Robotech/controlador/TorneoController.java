package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.modelo.Categoria;
import com.Robotech.BackEnd_Robotech.modelo.DTO.RegistroTorneoDTO;
import com.Robotech.BackEnd_Robotech.modelo.Sede;
import com.Robotech.BackEnd_Robotech.modelo.Torneo;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICategoriaServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ISedeServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ITorneoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/torneo")
@CrossOrigin(origins = "*")
public class TorneoController {
    private final ITorneoServicio torneoServicio;
    private final ICategoriaServicio categoriaServicio;
    private final ISedeServicio sedeServicio;

    @Autowired
    public TorneoController(ITorneoServicio torneoServicio, ICategoriaServicio categoriaServicio,ISedeServicio sedeServicio) {
        this.torneoServicio = torneoServicio;
        this.categoriaServicio = categoriaServicio;
        this.sedeServicio = sedeServicio;
    }
    //Registro de Torneos
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarTorneo(@RequestBody RegistroTorneoDTO torneoDTO) throws Exception {
        try{
            if ((torneoDTO.getCategoria() == null || torneoDTO.getCategoria().isEmpty())
                    || (torneoDTO.getSede() == null || torneoDTO.getSede().isEmpty())) {
                return ResponseEntity.badRequest().body("El nombre de la categoría o sede no puede estar vacío");
            }
            // Verificación de existencia de la categoría
            if (!categoriaServicio.verificarNombre(torneoDTO.getCategoria())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La categoría no existe");
            }

            // Verificación de existencia de la sede
            if (!sedeServicio.verificarNombreSede(torneoDTO.getSede())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La sede no existe");
            }
            Categoria categoria = categoriaServicio.buscarPorNombre(torneoDTO.getCategoria());
            Sede sede = sedeServicio.buscarPorNombre(torneoDTO.getSede());

            Torneo torneo = new Torneo(
                    categoria,
                    torneoDTO.getNombre_torneo(),
                    torneoDTO.getFoto(),
                    torneoDTO.getCantidad(),
                    torneoDTO.getFecha_inicio(),
                    torneoDTO.getFecha_final(),
                    torneoDTO.getEstado(),
                    sede);
            return ResponseEntity.ok(torneoServicio.agregarTorneo(torneo));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }
    @PutMapping("/estado/{id}")
    public ResponseEntity<?> actualizarEstado(@PathVariable int id, @RequestBody String nuevoEstado){
        try {
            Torneo torneo = torneoServicio.modificarEstado(id,nuevoEstado);
            return ResponseEntity.ok(torneo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }
    //Listar torneos  publicos
    @GetMapping("/publico")
    public ResponseEntity<?> listarTorneoPublico() throws Exception {
        return ResponseEntity.ok(torneoServicio.listarTorneosPublicos());
    }
    //Listar torneos con estado borrador
    @GetMapping("/borrador")
    public ResponseEntity<?> listarTorneoBorrador() throws Exception {
        return ResponseEntity.ok(torneoServicio.listarTorneosBorrador());
    }
}
