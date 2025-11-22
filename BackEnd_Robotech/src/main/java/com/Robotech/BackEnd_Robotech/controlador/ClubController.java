package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.modelo.Club;
import com.Robotech.BackEnd_Robotech.modelo.DTO.RegistroClubDTO;
import com.Robotech.BackEnd_Robotech.modelo.Identificador;
import com.Robotech.BackEnd_Robotech.modelo.Rol;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import com.Robotech.BackEnd_Robotech.servicios.implementacion.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/club")
@CrossOrigin(origins = "*")
public class ClubController {
    private ClubServiceImp clubService;
    private CompetidorServiceImp competidorService;
    private UsuarioServiceImp usuarioService;
    private RolServiceImp rolService;
    private IdentificadorServiceImp identificadorService;

    @Autowired
    public ClubController(IdentificadorServiceImp identificadorService, ClubServiceImp clubService,CompetidorServiceImp competidorService,RolServiceImp rolService,UsuarioServiceImp usuarioService){
        this.clubService = clubService;
        this.competidorService = competidorService;
        this.usuarioService = usuarioService;
        this.rolService = rolService;
        this.identificadorService = identificadorService;
    }
    @GetMapping
    public ResponseEntity<List<Club>> listarClubes() throws Exception {
        List<Club> clubes = clubService.listarClubes();
        return ResponseEntity.ok(clubes);
    }
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarClub(@RequestBody RegistroClubDTO registroClubDTO){
        try {
            Rol rol = rolService.obtenerPorNombre("Dueño de club");
            Usuario usuario = new Usuario(
                    registroClubDTO.getNombres(),
                    registroClubDTO.getCorreo(),
                    registroClubDTO.getDni(),
                    registroClubDTO.getPassword(),
                    registroClubDTO.getFoto(),
                    rol,
                    "PENDIENTE"
            );
            Usuario usuarioClub = usuarioService.agregarUsuario(usuario);
            Club club = new Club(
                    usuarioClub,
                    registroClubDTO.getNombreClub(),
                    registroClubDTO.getDireccion_fiscal(),
                    registroClubDTO.getTelefono(),
                    registroClubDTO.getLogo(),
                    "PENDIENTE"
            );
            Club clubRegistrado = clubService.registrarClub(club);
            return new ResponseEntity<>(clubRegistrado, HttpStatus.CREATED);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/GenerarCodigo/{id}")
    public ResponseEntity<String> generarCodigoInvitacion(@PathVariable int id){
        try {
            Club club = clubService.buscarPorID(id);
            Identificador identificador1 = new Identificador(club);
            Identificador identificador = identificadorService.registrarIdentificador(identificador1);
            return ResponseEntity.ok(identificador.getId());
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/{clubId}/validacion/{accion}")
    public ResponseEntity<String> validarClub(@PathVariable int clubId, @PathVariable String accion){
        try {
            Club club = clubService.buscarPorID(clubId);
            if (club == null){
                return new ResponseEntity<>("Club no encontrado", HttpStatus.NOT_FOUND);
            }
            if (!"permitir".equals(accion)){
                return new ResponseEntity<>("Club Rechazado correctamente",HttpStatus.FORBIDDEN);
            }
            club.setEstado("ACTIVO");
            club.getUsuario().setEstado("ACTIVO");
            clubService.registrarClub(club);

            return ResponseEntity.ok("Club Activo Correctamente");
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }


}
