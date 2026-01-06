package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.DTO.*;
import com.Robotech.BackEnd_Robotech.modelo.*;
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

    //Obtener club por propietario
    @GetMapping("/clubPropietario/{idPropietario}")
    public ResponseEntity<?> obtenerClubPorPropietario(@PathVariable int idPropietario) throws Exception{
        try {
            Usuario usuario = usuarioService.obtenerUsuarioPorId(idPropietario);
            if (!usuario.getRol().getNombre().equalsIgnoreCase("dueño de club")){
                return ResponseEntity.badRequest().body("No tienes un club registrado!");
            }
            Club club = clubService.obtenerPorUsuario(usuario);
            ClubDTO clubDTO = new ClubDTO(
                    club.getId(),
                    club.getUsuario().getId(),
                    club.getUsuario().getFoto(),
                    club.getUsuario().getNombres(),
                    club.getUsuario().getCorreo(),
                    club.getTelefono(),
                    club.getNombre(),
                    club.getLogo(),
                    club.getDireccion_fiscal(),
                    club.getEstado(),
                    club.getCreado_en()
            );
            return ResponseEntity.ok(clubDTO);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    //Listar clubes
    @GetMapping
    public ResponseEntity<?> listarClubes() throws Exception {
        List<Club> clubes = clubService.listarClubes();
        List<ClubDTO> clubs = clubes.stream()
                .map(club -> new ClubDTO(
                        club.getId(),
                        club.getUsuario().getId(),
                        club.getUsuario().getNombres(),
                        club.getUsuario().getFoto(),
                        club.getUsuario().getCorreo(),
                        club.getTelefono(),
                        club.getNombre(),
                        club.getDireccion_fiscal(),
                        club.getLogo(),
                        club.getEstado(),
                        club.getCreado_en(),
                        club.getPuntos()
                ))
                .toList();
        return ResponseEntity.ok(clubs);
    }

    //Obtener club por id
    @GetMapping("/obtenerClub/{id}")
    public ResponseEntity<?> obtenerClub(@PathVariable int id){
        try{
            return ResponseEntity.ok(clubService.obtenerPorId(id));
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    //obtener integrantes por id de club
    @GetMapping("/integrantes/{id}")
    public ResponseEntity<?> listarIntegrantesDeClub(@PathVariable int id){
        try {
            return ResponseEntity.ok(competidorService.listarCompetidorPorClub(id));
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    //Registrar club
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

    //Generar codigo de invitación para competidores
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

    //Validar club
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

    //Modificar datos del club
    @PutMapping("/modificar")
    public ResponseEntity<?> modificarClub(@RequestBody ModificarClubDTO modificarClubDTO){
        try {
            return ResponseEntity.ok(clubService.moficarDatosClub(modificarClubDTO));
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    //Obtener club por competidor
    @GetMapping("/competidorClub/{id}")
    public ResponseEntity<?> obtenerClubPorCompetidor(@PathVariable int id){
        try {
            Competidor competidor = competidorService.buscarPorId(id);
            Identificador identificador = identificadorService.obtenerIdentificadorPorCompetidor(competidor);
            CompetidorClubDTO competidorClubDTO = new CompetidorClubDTO();
            competidorClubDTO.setIdClub(identificador.getClub().getId());
            competidorClubDTO.setNombreClub(identificador.getClub().getNombre());
            return ResponseEntity.ok(competidorClubDTO);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }



}
