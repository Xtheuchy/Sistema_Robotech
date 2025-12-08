package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.modelo.Sede;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ISedeServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/sede")
@CrossOrigin(origins = "*")
public class SedeController {
    @Autowired
    private ISedeServicio sedeServicio;

    //Listar sedes
    @GetMapping
    public ResponseEntity<?> listarSedes(){
        try {
            return ResponseEntity.ok(sedeServicio.listarSedes());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    //Registrar sedes
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarSede(@RequestBody Sede sede){
        try {
            return ResponseEntity.ok(sedeServicio.agregarSede(sede));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    //Modificar sede
    @PutMapping("/modificar/{id}")
    public ResponseEntity<?> modificarSede(@PathVariable int id, @RequestBody Sede sd){
        try{
            Sede sede = sedeServicio.buscarPorId(id);
            sede.setNombreSede(sd.getNombreSede());
            sede.setDireccion(sd.getDireccion());
            sede.setCapacidad(sd.getCapacidad());
            return ResponseEntity.ok(sedeServicio.modificarSede(sede));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    //Eliminar sede
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminarSede(@PathVariable int id){
        try{
            sedeServicio.eliminarPorId(id);
            return ResponseEntity.ok("¡Eliminado correctamente!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


}
