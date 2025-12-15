package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.DTO.CompetidorDTO;
import com.Robotech.BackEnd_Robotech.DTO.LoginDTO;
import com.Robotech.BackEnd_Robotech.DTO.UsuarioDTO;
import com.Robotech.BackEnd_Robotech.modelo.Club;
import com.Robotech.BackEnd_Robotech.modelo.Competidor;
import com.Robotech.BackEnd_Robotech.modelo.Mensaje;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IClubServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICompetidorServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IMensajeServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IUsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController{
    private final IUsuarioServicio usuarioServicio;
    private final ICompetidorServicio competidorServicio;
    private final IClubServicio clubServicio;
    private final IMensajeServicio mensajeServicio;

    @Autowired
    public AuthController(IClubServicio clubServicio,IMensajeServicio mensajeServicio, IUsuarioServicio usuarioServicio,ICompetidorServicio competidorServicio){
        this.usuarioServicio = usuarioServicio;
        this.competidorServicio = competidorServicio;
        this.mensajeServicio = mensajeServicio;
        this.clubServicio = clubServicio;
    }

    //Login para la pagina admin
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

    // Login para la pagina cliente (Dueño de club y competidores)
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
            if (!usuarioValidado.getEstado().equalsIgnoreCase("activo")) {
                // Obtener el mensaje más reciente del usuario
                Mensaje ultimoMensaje = mensajeServicio.obtenerPorUsuario(usuarioValidado);
                // Preparar el mensaje de error
                String textoError = (ultimoMensaje != null)
                        ? "Su solicitud de registro fue rechazada, Razón: \n" + ultimoMensaje.getMensaje() + "\nPor favor, intente registrarse nuevamente."
                        : "¡Su cuenta no está activa!";

                // Si existe un mensaje, eliminar el club y el usuario
                if (ultimoMensaje != null) {
                    try {
                        Club club = clubServicio.obtenerPorUsuario(usuarioValidado);
                        Mensaje mensaje = mensajeServicio.obtenerPorUsuario(usuarioValidado);
                        clubServicio.eliminarPorId(club.getId());
                        mensajeServicio.eliminarMensajePorId(mensaje.getId());
                        usuarioServicio.eliminarUsuario(usuarioValidado.getId());
                    } catch (Exception e) {
                        // Manejar excepciones si la eliminación falla
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar los datos asociados al usuario.");
                    }
                }
                // Retornar el mensaje de error
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(textoError);
            }
            if (!(usuarioValidado.getRol().getNombre().equalsIgnoreCase("Juez") || usuarioValidado.getRol().getNombre().equalsIgnoreCase("Administrador"))){
                if (usuarioValidado.getRol().getNombre().equalsIgnoreCase("Competidor")){
                    Competidor competidor = competidorServicio.buscarCompetidorPorUsuario(usuarioValidado);
                    CompetidorDTO competidorDTO = new CompetidorDTO(
                            competidor.getId(),
                            competidor.getApodo(),
                            competidor.getUsuario().getNombres(),
                            competidor.getUsuario().getCorreo(),
                            competidor.getUsuario().getRol().getNombre(),
                            competidor.getUsuario().getDni(),
                            competidor.getUsuario().getFoto(),
                            competidor.getUsuario().getEstado());
                    return ResponseEntity.ok(competidorDTO);
                }else {
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
                }
            }else {
                return new ResponseEntity<>("El acceso está restringido a clubes y competidores.", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en el servidor: " + e.getMessage());
        }
    }
}

