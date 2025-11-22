package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.modelo.Competidor;
import com.Robotech.BackEnd_Robotech.modelo.DTO.RegistroCompetidorDTO;
import com.Robotech.BackEnd_Robotech.modelo.Identificador;
import com.Robotech.BackEnd_Robotech.modelo.Rol;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import com.Robotech.BackEnd_Robotech.repositorio.ICompetidorRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.implementacion.CompetidorServiceImp;
import com.Robotech.BackEnd_Robotech.servicios.implementacion.IdentificadorServiceImp;
import com.Robotech.BackEnd_Robotech.servicios.implementacion.RolServiceImp;
import com.Robotech.BackEnd_Robotech.servicios.implementacion.UsuarioServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/competidor")
@CrossOrigin(origins = "*")
public class CompetidorController {
    private CompetidorServiceImp competidorService;
    private IdentificadorServiceImp identificadorService;
    private RolServiceImp rolService;
    private UsuarioServiceImp usuarioService;
    private ICompetidorRepositorio competidorRepositorio;
    @Autowired
    public CompetidorController(ICompetidorRepositorio competidorRepositorio,UsuarioServiceImp usuarioService,RolServiceImp rolService,CompetidorServiceImp competidorService, IdentificadorServiceImp identificadorService){
        this.competidorService = competidorService;
        this.identificadorService = identificadorService;
        this.rolService = rolService;
        this.usuarioService = usuarioService;
        this.competidorRepositorio = competidorRepositorio;
    }
    @PostMapping("/Registrar")
    public ResponseEntity<?> registrarCompetidor(@RequestBody RegistroCompetidorDTO competidorDTO) throws Exception{
        try{
            if(competidorDTO.getCodigoUnico() == null){

            }
            Rol rol = rolService.obtenerPorNombre("Competidor");
            Identificador identificador = identificadorService.buscarIdentificador(competidorDTO.getCodigoUnico());
            if (identificador.getClub().getEstado().equalsIgnoreCase("PENDIENTE")){
                return ResponseEntity.badRequest().body("¡El club esta inactivo!");
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
                if (competidorRepositorio.existsByApodo(competidorDTO.getApodo())){
                    return ResponseEntity.badRequest().body("¡Existe este apodo!");
                }
                Usuario usuario1 = usuarioService.agregarUsuario(usuario);
                Competidor competidor = new Competidor(competidorDTO.getApodo(),usuario1);
                Competidor competidor1 = competidorService.registrarCompetidor(competidor);
                identificador.setCompetidor(competidor1);
                Identificador identificador1 = identificadorService.editarIdentificador(identificador);
                return ResponseEntity.ok(identificador1);
            }else {
                return ResponseEntity.badRequest().body("¡El código ya fue usado!");
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


}
