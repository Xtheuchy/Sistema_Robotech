package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.DTO.ClubDTO;
import com.Robotech.BackEnd_Robotech.DTO.UsuarioDTO;
import com.Robotech.BackEnd_Robotech.DTO.ValidarClubDTO;
import com.Robotech.BackEnd_Robotech.modelo.*;
import com.Robotech.BackEnd_Robotech.DTO.RegistroClubDTO;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/club")
@CrossOrigin(origins = "*")
public class ClubController {
    private final IClubServicio clubService;
    private final ICompetidorServicio competidorService;
    private final IUsuarioServicio usuarioService;
    private final IRolServicio rolService;
    private final IIdentificadorServicio identificadorService;
    private final IMensajeServicio mensajeServicio;

    @Autowired
    public ClubController(IMensajeServicio mensajeServicio,IIdentificadorServicio identificadorService, IClubServicio clubService, ICompetidorServicio competidorService, IRolServicio rolService, IUsuarioServicio usuarioService){
        this.clubService = clubService;
        this.competidorService = competidorService;
        this.usuarioService = usuarioService;
        this.rolService = rolService;
        this.identificadorService = identificadorService;
        this.mensajeServicio = mensajeServicio;
    }

    @GetMapping
    public ResponseEntity<?> listarClubes() throws Exception {
        List<Club> clubes = clubService.listarClubes();
        List<ClubDTO> clubs = clubes.stream()
                .map(club -> new ClubDTO(
                        club.getId(),
                        club.getUsuario().getNombres(),
                        club.getUsuario().getFoto(),
                        club.getUsuario().getCorreo(),
                        club.getTelefono(),
                        club.getNombre(),
                        club.getDireccion_fiscal(),
                        club.getLogo(),
                        club.getEstado(),
                        club.getCreado_en()
                ))
                .toList();
        return ResponseEntity.ok(clubs);
    }
    @GetMapping("/obtenerClub/{id}")
    public ResponseEntity<?> obtenerClub(@PathVariable int id){
        try{
            return ResponseEntity.ok(clubService.obtenerPorId(id));
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/integrantes/{id}")
    public ResponseEntity<?> listarIntegrantesDeClub(@PathVariable int id){
        try {
            return ResponseEntity.ok(competidorService.listarCompetidorPorClub(id));
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
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
            Club clubRegistrado = clubService.registrarClub(registroClubDTO, usuario);
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
    @PutMapping("/validacion")
    public ResponseEntity<String> validarClub(@RequestBody ValidarClubDTO validarClubDTO) {
        try {
            Mensaje mensaje;
            // Buscar el club por ID
            Club club = clubService.buscarPorID(validarClubDTO.getId());

            // Si no se encuentra el club, devolver 404 Not Found
            if (club == null) {
                return new ResponseEntity<>("Club no encontrado", HttpStatus.NOT_FOUND);
            }

            // Verificar la acción (permitir o rechazar)
            if (!"permitir".equals(validarClubDTO.getAccion())) {
                if (validarClubDTO.getMensaje() == null || validarClubDTO.getMensaje().isEmpty()){
                    return new ResponseEntity<>("Necesitar ingresar la razón por la cual se rechaza el club",HttpStatus.BAD_REQUEST);
                }
                mensaje = mensajeServicio.registrarMensaje(
                        new Mensaje(
                        club.getUsuario(),
                        validarClubDTO.getMensaje()));
                club.setEstado("RECHAZADO");
                club.getUsuario().setEstado("RECHAZADO");
                clubService.modificarClub(club);
                return new ResponseEntity<>("Club Rechazado correctamente.", HttpStatus.ACCEPTED);
            }

            // Cambiar el estado del club y del usuario asociado
            club.setEstado("ACTIVO");
            club.getUsuario().setEstado("ACTIVO");

            // Registrar el club actualizado
            clubService.modificarClub(club);

            // Devolver una respuesta exitosa
            return ResponseEntity.ok("Club Activo Correctamente");
        } catch (Exception e) {
            // En caso de error, devolver un mensaje de error con código 400 (Bad Request)
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }



}
