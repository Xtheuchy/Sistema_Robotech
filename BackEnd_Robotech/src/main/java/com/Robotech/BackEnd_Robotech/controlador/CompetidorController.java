package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.modelo.Competidor;
import com.Robotech.BackEnd_Robotech.DTO.RegistroCompetidorDTO;
import com.Robotech.BackEnd_Robotech.modelo.Identificador;
import com.Robotech.BackEnd_Robotech.modelo.Rol;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICompetidorServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IIdentificadorServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IRolServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IUsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/competidor")
@CrossOrigin(origins = "*")
public class CompetidorController {
    private final ICompetidorServicio competidorService;
    private final IIdentificadorServicio identificadorService;
    private final IRolServicio rolService;
    private final IUsuarioServicio usuarioService;
    @Autowired
    public CompetidorController(ICompetidorServicio competidorService,IUsuarioServicio usuarioService,IRolServicio rolService,IIdentificadorServicio identificadorService){
        this.competidorService = competidorService;
        this.identificadorService = identificadorService;
        this.rolService = rolService;
        this.usuarioService = usuarioService;
    }

    //Registrar competidor
    @PostMapping("/Registrar")
    public ResponseEntity<?> registrarCompetidor(@RequestBody RegistroCompetidorDTO competidorDTO) throws Exception{
        try{
            if (competidorDTO.getCodigoUnico() == null || competidorDTO.getCodigoUnico().isEmpty()) {
                return new ResponseEntity<>("El código único es obligatorio para registrarse.", HttpStatus.BAD_REQUEST);
            }
            Rol rol = rolService.obtenerPorNombre("Competidor");
            Identificador identificador = identificadorService.buscarIdentificador(competidorDTO.getCodigoUnico());
            if (identificador.getClub().getEstado().equalsIgnoreCase("PENDIENTE")){
                return ResponseEntity.badRequest().body("El club está inactivo, no se puede registrar");
            }
            if (identificador.getCompetidor() == null){
                Usuario usuario = new Usuario(
                        competidorDTO.getNombres(),
                        competidorDTO.getCorreo(),
                        competidorDTO.getDni(),
                        competidorDTO.getPassword(),
                        competidorDTO.getFoto(),
                        rol,
                        "ACTIVO"
                );
                if (competidorService.verificarApodo(competidorDTO.getApodo())){
                    return ResponseEntity.badRequest().body("El apodo ya está en uso, por favor elige otro.");
                }
                Usuario usuario1 = usuarioService.agregarUsuario(usuario);
                Competidor competidor = new Competidor(competidorDTO.getApodo(),usuario1);
                Competidor competidor1 = competidorService.registrarCompetidor(competidor);
                identificador.setCompetidor(competidor1);
                Identificador identificador1 = identificadorService.editarIdentificador(identificador);
                return ResponseEntity.ok(identificador1);
            }else {
                return ResponseEntity.badRequest().body("El código único ya ha sido utilizado.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

}
