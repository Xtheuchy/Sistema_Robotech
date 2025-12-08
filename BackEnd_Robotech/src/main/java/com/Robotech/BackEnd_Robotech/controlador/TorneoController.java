package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.modelo.Categoria;
import com.Robotech.BackEnd_Robotech.DTO.RegistroTorneoDTO;
import com.Robotech.BackEnd_Robotech.DTO.TorneoDTO;
import com.Robotech.BackEnd_Robotech.modelo.Sede;
import com.Robotech.BackEnd_Robotech.modelo.Torneo;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICategoriaServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ISedeServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ITorneoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


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
            Torneo torneo;
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

            torneo = new Torneo(
                    torneoDTO.getDescripcion_torneo(),
                    categoria,
                    torneoDTO.getNombre_torneo(),
                    torneoDTO.getFoto(),
                    torneoDTO.getCantidad(),
                    torneoDTO.getFecha_inicio(),
                    torneoDTO.getFecha_final(),
                    torneoDTO.getEstado(),
                    sede);
            torneo = torneoServicio.agregarTorneo(torneo);
            TorneoDTO torneoR = new TorneoDTO(
                    torneo.getId(),
                    torneo.getNombre(),
                    torneo.getDescripcion(),
                    torneo.getFoto(),
                    torneo.getCantidad(),
                    torneo.getFechaInicio(),
                    torneo.getFechaFinal(),
                    torneo.getEstado(),
                    torneo.getCreado_en(),
                    torneo.getCategoria().getNombre(),
                    torneo.getCategoria().getDescripcion(),torneo.getSede().getNombreSede(),
                    torneo.getSede().getDireccion());
            return ResponseEntity.ok(torneoR);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }
    //Modificar estado de torneo
    @PutMapping("/torneo/{id}/nuevoEstado/{nuevoEstado}")
    public ResponseEntity<?> actualizarEstado(@PathVariable int id, @PathVariable String nuevoEstado){
        try {
            Torneo torneo = torneoServicio.modificarEstado(id,nuevoEstado);
            return ResponseEntity.ok(torneo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }
    //Modificar Torneo
    @PutMapping("/modificar")
    public ResponseEntity<?> actualizarTorneo(@RequestBody RegistroTorneoDTO torneoDTO) throws Exception{
        try {
            Torneo torneo;
            if (torneoDTO.getId() == 0){
                return ResponseEntity.badRequest().body("El torneo debe tener un id para modficar");
            }
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


            torneo = torneoServicio.modificarTorneo(torneoDTO);
            TorneoDTO torneoM = new TorneoDTO(
                    torneo.getId(),
                    torneo.getNombre(),
                    torneo.getDescripcion(),
                    torneo.getFoto(),
                    torneo.getCantidad(),
                    torneo.getFechaInicio(),
                    torneo.getFechaFinal(),
                    torneo.getEstado(),
                    torneo.getCreado_en(),
                    torneo.getCategoria().getNombre(),
                    torneo.getCategoria().getDescripcion(),torneo.getSede().getNombreSede(),
                    torneo.getSede().getDireccion()
            );

            return ResponseEntity.ok(torneoM);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarTorneoPorId(@PathVariable int id) throws Exception {
        try {
            torneoServicio.eliminarPorId(id);
            return ResponseEntity.ok("Eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }
    //Obtener torneo por id
    @GetMapping("/torneoId/{id}")
    public ResponseEntity<?> obtenerTorneoPorId(@PathVariable int id){
        try{
            Torneo torneo = torneoServicio.obtenerPorId(id);
            TorneoDTO torneoDTO = new TorneoDTO(
                    torneo.getId(),
                    torneo.getNombre(),
                    torneo.getDescripcion(),
                    torneo.getFoto(),
                    torneo.getCantidad(),
                    torneo.getFechaInicio(),
                    torneo.getFechaFinal(),
                    torneo.getEstado(),
                    torneo.getCreado_en(),
                    torneo.getCategoria().getNombre(),
                    torneo.getCategoria().getDescripcion(),
                    torneo.getSede().getNombreSede(),
                    torneo.getSede().getDireccion()
            );
            return ResponseEntity.ok(torneoDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    //Listar todos los torneos
    @GetMapping("/torneos")
    public ResponseEntity<?> listarTorneos()throws Exception{
        try{
            List<Torneo> torneos = torneoServicio.listarTorneos();

            List<TorneoDTO> torneoList = torneos.stream()
                    .map(torneo -> new TorneoDTO(
                            torneo.getId(),
                            torneo.getNombre(),
                            torneo.getDescripcion(),
                            torneo.getFoto(),
                            torneo.getCantidad(),
                            torneo.getFechaInicio(),
                            torneo.getFechaFinal(),
                            torneo.getEstado(),
                            torneo.getCreado_en(),
                            torneo.getCategoria().getNombre(),
                            torneo.getCategoria().getDescripcion(),torneo.getSede().getNombreSede(),
                            torneo.getSede().getDireccion()
                    ))
                    .toList();
            return ResponseEntity.ok(torneoList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }



    //Listar torneos  publicos
    @GetMapping("/publico")
    public ResponseEntity<?> listarTorneoPublico() throws Exception {
        try{
            List<Torneo> torneos = torneoServicio.listarTorneosPublicos();

            List<TorneoDTO> torneoList = torneos.stream()
                    .map(torneo -> new TorneoDTO(
                            torneo.getId(),
                            torneo.getNombre(),
                            torneo.getDescripcion(),
                            torneo.getFoto(),
                            torneo.getCantidad(),
                            torneo.getFechaInicio(),
                            torneo.getFechaFinal(),
                            torneo.getEstado(),
                            torneo.getCreado_en(),
                            torneo.getCategoria().getNombre(),
                            torneo.getCategoria().getDescripcion(),torneo.getSede().getNombreSede(),
                            torneo.getSede().getDireccion()
                    ))
                    .toList();
            return ResponseEntity.ok(torneoList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    //Listar torneos con estado borrador
    @GetMapping("/borrador")
    public ResponseEntity<?> listarTorneoBorrador() throws Exception {
        List<Torneo> torneos = torneoServicio.listarTorneosBorrador();

        List<TorneoDTO> torneoList = torneos.stream()
                .map(torneo -> new TorneoDTO(
                        torneo.getId(),
                        torneo.getNombre(),
                        torneo.getDescripcion(),
                        torneo.getFoto(),
                        torneo.getCantidad(),
                        torneo.getFechaInicio(),
                        torneo.getFechaFinal(),
                        torneo.getEstado(),
                        torneo.getCreado_en(),
                        torneo.getCategoria().getNombre(),
                        torneo.getCategoria().getDescripcion(),torneo.getSede().getNombreSede(),
                        torneo.getSede().getDireccion()
                ))
                .toList();
        if (torneoList.isEmpty()){
            return ResponseEntity.badRequest().body("No hay torneos creados");
        }
        return ResponseEntity.ok(torneoList);
    }
}
