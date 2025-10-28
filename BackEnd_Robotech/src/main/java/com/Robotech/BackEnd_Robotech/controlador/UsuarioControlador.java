package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IUsuarioServicio; // Inyectamos la interfaz IUsuarioServicio
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios") // Define la ruta base para todos los endpoints: /api/usuarios
@CrossOrigin(origins = "*") // Permite que cualquier front-end pueda acceder a esta API (ajustar en producción)
public class UsuarioControlador {

    private final IUsuarioServicio usuarioServicio;
    @Autowired
    public UsuarioControlador(IUsuarioServicio usuarioServicio) {
        this.usuarioServicio = usuarioServicio;
    }

    // --- 1. REGISTRO / CREAR USUARIO (POST) ---
    // Ruta: POST /api/usuarios/registrar
    // Esta ruta debe ser pública (permit All) en SecurityConfiguration
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario usuario) {
        try {
            // Llama al servicio, que encripta la contraseña, valida el DNI/Correo/Nombre y asigna el Rol.
            Usuario nuevoUsuario = usuarioServicio.agregarUsuario(usuario);

            // Retorna el objeto creado con el ID generado y un estado 201 CREATED.
            return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
        } catch (Exception e) {
            // Captura errores de validación del servicio (duplicados, rol no existe)
            // Retorna el mensaje de error y un estado 400 BAD REQUEST.
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Integer id, @RequestBody Usuario usuario) {
        try {
            Usuario usuarioActualizado = usuarioServicio.actualizarUsuario(id, usuario);
            return ResponseEntity.ok(usuarioActualizado); // 200 OK
        } catch (Exception e) {
            // Manejamos los dos tipos de error que puede lanzar el servicio
            if (e.getMessage().contains("no encontrado")) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND); // 404
            }
            // Cualquier otro error (duplicado, rol no existe)
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST); // 400
        }
    }
    // --- 2. LISTAR TODOS LOS USUARIOS (GET) ---
    // Ruta: GET /api/usuarios
    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() throws Exception {
        List<Usuario> usuarios = usuarioServicio.listarUsuarios();
        return ResponseEntity.ok(usuarios); // Retorna la lista con estado 200 OK.
    }

    // --- 3. OBTENER USUARIO POR ID (GET) ---
    // Ruta: GET /api/usuarios/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerUsuarioPorId(@PathVariable Integer id) {
        try {
            Usuario usuario = usuarioServicio.obtenerUsuarioPorId(id);
            return ResponseEntity.ok(usuario); // Retorna el usuario con estado 200 OK.
        } catch (Exception e) {
            //Si el servicio lanza la excepción (Usuario no encontrado), devolvemos 404 NOT FOUND.
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // --- 4. ELIMINAR USUARIO POR ID (DELETE) ---
    // Ruta: DELETE /api/usuarios/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Integer id) {
        try {
            usuarioServicio.eliminarUsuario(id);
            // Si la eliminación es exitosa, se devuelve 204 NO CONTENT (sin cuerpo de respuesta).
            return new ResponseEntity<>("Usuario con ID " + id + " eliminado correctamente.", HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            // Si el servicio lanza la excepción (Usuario no encontrado), devolvemos 404 NOT FOUND.
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}

