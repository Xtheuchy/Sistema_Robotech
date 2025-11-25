package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.modelo.DTO.LoginDTO;
import com.Robotech.BackEnd_Robotech.modelo.DTO.UsuarioDTO;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IUsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController{
    @Autowired
    private IUsuarioServicio usuarioServicio;

    // Login para la pagina admin
    @PostMapping("/login/admin")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginDTO usuarioLoginDTO) {
        try {
            Usuario usuarioValidado = usuarioServicio.obtenerUsuarioPorCorreo(usuarioLoginDTO.getCorreo());
            if (usuarioValidado == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no encontrado");
            }
            if (!usuarioServicio.verificarPassword(usuarioLoginDTO.getPassword(), usuarioValidado.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
            }
            if (!usuarioValidado.getEstado().equalsIgnoreCase("activo")){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("¡Su cuenta no está activa!");
            }
            if (usuarioValidado.getRol().getNombre().equalsIgnoreCase("Juez")|| usuarioValidado.getRol().getNombre().equalsIgnoreCase("Administrador")){
                UsuarioDTO usuarioDTO = new UsuarioDTO(
                        usuarioValidado.getId(),
                        usuarioValidado.getNombres(),
                        usuarioValidado.getCorreo(),
                        usuarioValidado.getRol().getNombre(),
                        usuarioValidado.getDni(),
                        usuarioValidado.getFoto(),
                        usuarioValidado.getEstado()
                );
                return ResponseEntity.ok(usuarioDTO);
            }else {
                return new ResponseEntity<>("El acceso está restringido a administradores y jueces.", HttpStatus.UNAUTHORIZED);
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en el servidor: " + e.getMessage());
        }
    }

    // Login para la pagina cliente
    @PostMapping("/login/cliente")
    public ResponseEntity<?> loginCliente(@RequestBody LoginDTO usuarioLoginDTO) {
        try {
            Usuario usuarioValidado = usuarioServicio.obtenerUsuarioPorCorreo(usuarioLoginDTO.getCorreo());
            if (usuarioValidado == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no encontrado");
            }
            if (!usuarioServicio.verificarPassword(usuarioLoginDTO.getPassword(), usuarioValidado.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
            }
            if (!usuarioValidado.getEstado().equalsIgnoreCase("activo")){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("¡Su cuenta no está activa!");
            }
            if (!(usuarioValidado.getRol().getNombre().equalsIgnoreCase("Juez") || usuarioValidado.getRol().getNombre().equalsIgnoreCase("Administrador"))){
                UsuarioDTO usuarioDTO = new UsuarioDTO(
                        usuarioValidado.getId(),
                        usuarioValidado.getNombres(),
                        usuarioValidado.getCorreo(),
                        usuarioValidado.getRol().getNombre(),
                        usuarioValidado.getDni(),
                        usuarioValidado.getFoto(),
                        usuarioValidado.getEstado()
                );
                return ResponseEntity.ok(usuarioDTO);
            }else {
                return new ResponseEntity<>("El acceso está restringido a clubes y competidores.", HttpStatus.UNAUTHORIZED);
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en el servidor: " + e.getMessage());
        }
    }

}

