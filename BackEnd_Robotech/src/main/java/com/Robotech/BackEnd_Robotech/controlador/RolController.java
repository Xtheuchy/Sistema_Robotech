package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.modelo.Rol;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IRolServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "*")
public class RolController {
    private final IRolServicio rolServicio;

    @Autowired
    public RolController(IRolServicio rolServicio) {
        this.rolServicio = rolServicio;
    }
    // --- 1. REGISTRO / CREAR USUARIO (POST) ---
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarRol(@RequestBody Rol rol) {
        try {
            // Llama al servicio, que encripta la contraseña, valida el DNI/Correo/Nombre y asigna el Rol.
            Rol nuevoRol = rolServicio.agregarRol(rol);

            // Retorna el objeto creado con el ID generado y un estado 201 CREATED.
            return new ResponseEntity<>(rol, HttpStatus.CREATED);

        } catch (Exception e) {
            // Captura errores de validación del servicio (duplicados, rol no existe)
            // Retorna el mensaje de error y un estado 400 BAD REQUEST.
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    // --- 2. LISTAR TODOS LOS ROLES (GET) ---
    @GetMapping
    public ResponseEntity<List<Rol>> listarRoles() throws Exception{
        List<Rol> Roles = rolServicio.listarRoles();
        return ResponseEntity.ok(Roles);
    }

    // --- 3. OBTENER ROL POR NOMBRE (GET) ---
    @GetMapping("/{nombre}")
    public ResponseEntity<?> obtenerRolPorNombre(@PathVariable String nombre){
        try{
            Rol rol = rolServicio.obtenerPorNombre(nombre);
            return ResponseEntity.ok(rol);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
