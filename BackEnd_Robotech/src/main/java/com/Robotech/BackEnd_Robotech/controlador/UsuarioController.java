package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.DTO.RegistroDTO;
import com.Robotech.BackEnd_Robotech.DTO.UsuarioDTO;
import com.Robotech.BackEnd_Robotech.modelo.Rol;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IRolServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IUsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {
    private final IUsuarioServicio usuarioServicio;
    private final IRolServicio rolServicio;

    @Autowired
    public UsuarioController(IUsuarioServicio usuarioServicio, IRolServicio rolServicio) {
        this.usuarioServicio = usuarioServicio;
        this.rolServicio = rolServicio;
    }
    // --- 1. REGISTRO USUARIO (POST) ---
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@RequestBody RegistroDTO registroDTO) {
        try {
            Rol roldb = rolServicio.obtenerPorNombre(registroDTO.getRol());
            Usuario usuario = new Usuario(
                    registroDTO.getNombres(),
                    registroDTO.getCorreo(),
                    registroDTO.getDni(),
                    registroDTO.getPassword(),
                    registroDTO.getFoto(),
                    roldb,
                    registroDTO.getEstado()
            );
            Usuario nuevoUsuario = usuarioServicio.agregarUsuario(usuario);

            // Retorna el objeto creado con el ID generado y un estado 201 CREATED.
            return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
        } catch (Exception e) {
            // Retorna el mensaje de error y un estado 400 BAD REQUEST.
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    // --- 2. ACTUALIZAR USUARIO (PUT) ---
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Integer id, @RequestBody RegistroDTO usuarioDTO) {
        try {
            Rol roldb = rolServicio.obtenerPorNombre(usuarioDTO.getRol());
            Usuario usuario = new Usuario(usuarioDTO.getNombres(),usuarioDTO.getCorreo(),usuarioDTO.getDni(),usuarioDTO.getPassword(),usuarioDTO.getFoto(),roldb);
            Usuario usuarioActualizado = usuarioServicio.actualizarUsuario(id, usuario);
            return ResponseEntity.ok(usuarioActualizado); // 200 OK
        } catch (Exception e) {
            // Manejamos los dos tipos de error que puede lanzar el servicio
            if (e.getMessage().contains("no encontrado")) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND); // 404
            }
            // Cualquier otro error en caso de duplicado o no encontrado
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST); // 400
        }
    }
    // --- 3. LISTAR TODOS LOS USUARIOS (GET) ---
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listarUsuarios() throws Exception {
        List<Usuario> usuarios = usuarioServicio.listarUsuarios();

        List<UsuarioDTO> usuariosDTO = usuarios.stream()
                .map(usuario -> new UsuarioDTO(
                        usuario.getId(),
                        usuario.getNombres(),
                        usuario.getCorreo(),
                        usuario.getRol().getNombre(),
                        usuario.getDni(),
                        usuario.getFoto(),
                        usuario.getEstado()
                ))
                .toList();
        // Retornar la respuesta
        return ResponseEntity.ok(usuariosDTO);
    }
    @GetMapping("/listar")
    public ResponseEntity<?> listarAdminyJuez() throws Exception{
        List<Usuario> usuarios = usuarioServicio.listarAdministradoryJuez();
        List<UsuarioDTO> usuariosDTO = usuarios.stream()
                .map(usuario -> new UsuarioDTO(
                        usuario.getId(),
                        usuario.getNombres(),
                        usuario.getCorreo(),
                        usuario.getRol().getNombre(),
                        usuario.getDni(),
                        usuario.getFoto(),
                        usuario.getEstado()
                ))
                .toList();
        return ResponseEntity.ok(usuariosDTO);
    }
    // --- 4. OBTENER USUARIO POR ID (GET) ---
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerUsuarioPorId(@PathVariable Integer id) {
        try {
            Usuario usuario = usuarioServicio.obtenerUsuarioPorId(id);
            return ResponseEntity.ok(usuario); // Retorna el usuario con estado 200 OK
        } catch (Exception e) {
            //Si el servicio lanza la excepción es usuario no fue encontrado, devolvemos 404 NOT FOUND
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    // --- 5. ELIMINAR USUARIO POR ID (DELETE) ---
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Integer id) {
        try {
            usuarioServicio.eliminarUsuario(id);
            // Si la eliminación es exitosa, se devuelve 204 NO CONTENT
            return new ResponseEntity<>("Usuario con ID " + id + " eliminado correctamente.", HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            //Devolvemos 404 NOT FOUND.
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}

