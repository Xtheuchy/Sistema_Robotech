package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.modelo.DTO.LoginDTO;
import com.Robotech.BackEnd_Robotech.modelo.DTO.UsuarioDTO;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import com.Robotech.BackEnd_Robotech.servicios.implementacion.UsuarioServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController{
    @Autowired
    private UsuarioServiceImp usuarioServiceImp; // Servicio que gestiona usuarios

    // Login de usuarios
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO usuarioLoginDTO) {
        try {
            Usuario usuarioValidado = usuarioServiceImp.obtenerUsuarioPorCorreo(usuarioLoginDTO.getCorreo());

            if (usuarioValidado == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no encontrado");
            }

            if (!usuarioServiceImp.verificarPassword(usuarioLoginDTO.getPassword(), usuarioValidado.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
            }

            UsuarioDTO usuarioDTO = new UsuarioDTO(
                    usuarioValidado.getId(),
                    usuarioValidado.getNombres(),
                    usuarioValidado.getCorreo(),
                    usuarioValidado.getRol().getNombre(),
                    usuarioValidado.getDni(),
                    usuarioValidado.getFoto()
            );

            return ResponseEntity.ok(usuarioDTO);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en el servidor: " + e.getMessage());
        }
    }
}

