package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.DTO.RegistroCompetidorDTO;
import com.Robotech.BackEnd_Robotech.modelo.Club;
import com.Robotech.BackEnd_Robotech.modelo.Competidor;
import com.Robotech.BackEnd_Robotech.modelo.Identificador;
import com.Robotech.BackEnd_Robotech.modelo.Rol;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICompetidorServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IIdentificadorServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IRolServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IUsuarioServicio;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class CompetidorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ICompetidorServicio competidorService;

    @MockitoBean
    private IIdentificadorServicio identificadorService;

    @MockitoBean
    private IRolServicio rolService;

    @MockitoBean
    private IUsuarioServicio usuarioService;

    @Autowired
    private ObjectMapper objectMapper;

    private RegistroCompetidorDTO registroCompetidorDTO;
    private Identificador identificador;
    private Club club;
    private Usuario usuario;
    private Rol rol;
    private Competidor competidor;

    @BeforeEach
    void setUp() {
        registroCompetidorDTO = new RegistroCompetidorDTO();
        registroCompetidorDTO.setCodigoUnico("COD123");
        registroCompetidorDTO.setNombres("Juan Competidor");
        registroCompetidorDTO.setCorreo("juan@gmail.com");
        registroCompetidorDTO.setDni("87654321");
        registroCompetidorDTO.setPassword("Pass123!");
        registroCompetidorDTO.setApodo("Juancho");
        registroCompetidorDTO.setFoto("url_foto");

        rol = new Rol();
        rol.setId(3);
        rol.setNombre("Competidor");

        usuario = new Usuario();
        usuario.setId(2);
        usuario.setNombres(registroCompetidorDTO.getNombres());

        club = new Club();
        club.setId(1);
        club.setEstado("ACTIVO");

        identificador = new Identificador();
        identificador.setId("COD123");
        identificador.setClub(club);
        identificador.setCompetidor(null); // Inicialmente libre

        competidor = new Competidor();
        competidor.setId(1);
        competidor.setApodo(registroCompetidorDTO.getApodo());
        competidor.setUsuario(usuario);
    }

    @Test
    @DisplayName("Caso 1: Registro exitoso")
    void registrarCompetidor_Exitoso() throws Exception {
        when(rolService.obtenerPorNombre("Competidor")).thenReturn(rol);
        when(identificadorService.buscarIdentificador("COD123")).thenReturn(identificador);
        when(competidorService.verificarApodo("Juancho")).thenReturn(false); // Apodo libre
        when(usuarioService.agregarUsuario(any(Usuario.class))).thenReturn(usuario);
        when(competidorService.registrarCompetidor(any(Competidor.class))).thenReturn(competidor);

        Identificador identificadorActualizado = new Identificador();
        identificadorActualizado.setId("COD123");
        identificadorActualizado.setClub(club);
        identificadorActualizado.setCompetidor(competidor);

        when(identificadorService.editarIdentificador(any(Identificador.class))).thenReturn(identificadorActualizado);

        mockMvc.perform(post("/api/competidor/Registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroCompetidorDTO)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Caso 2: Código único vacío")
    void registrarCompetidor_CodigoVacio() throws Exception {
        registroCompetidorDTO.setCodigoUnico("");

        mockMvc.perform(post("/api/competidor/Registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroCompetidorDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("El código único es obligatorio para registrarse."));
    }

    @Test
    @DisplayName("Caso 3: Club inactivo")
    void registrarCompetidor_ClubInactivo() throws Exception {
        club.setEstado("PENDIENTE"); // Club inactivo
        identificador.setClub(club);

        when(rolService.obtenerPorNombre("Competidor")).thenReturn(rol);
        when(identificadorService.buscarIdentificador("COD123")).thenReturn(identificador);

        mockMvc.perform(post("/api/competidor/Registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroCompetidorDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("El club está inactivo, no se puede registrar"));
    }

    @Test
    @DisplayName("Caso 4: Código ya utilizado")
    void registrarCompetidor_CodigoUsado() throws Exception {
        identificador.setCompetidor(new Competidor()); // Código ya tiene competidor

        when(rolService.obtenerPorNombre("Competidor")).thenReturn(rol);
        when(identificadorService.buscarIdentificador("COD123")).thenReturn(identificador);

        mockMvc.perform(post("/api/competidor/Registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroCompetidorDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("El código único ya ha sido utilizado."));
    }

    @Test
    @DisplayName("Caso 5: Apodo duplicado")
    void registrarCompetidor_ApodoDuplicado() throws Exception {
        when(rolService.obtenerPorNombre("Competidor")).thenReturn(rol);
        when(identificadorService.buscarIdentificador("COD123")).thenReturn(identificador);
        when(competidorService.verificarApodo("Juancho")).thenReturn(true); // Apodo ya existe

        mockMvc.perform(post("/api/competidor/Registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroCompetidorDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("El apodo ya está en uso, por favor elige otro."));
    }

    @Test
    @DisplayName("Caso 6: Error al registrar usuario (validación)")
    void registrarCompetidor_ErrorUsuario() throws Exception {
        when(rolService.obtenerPorNombre("Competidor")).thenReturn(rol);
        when(identificadorService.buscarIdentificador("COD123")).thenReturn(identificador);
        when(competidorService.verificarApodo("Juancho")).thenReturn(false);

        // Simular error en validación de usuario (ej. pass débil)
        when(usuarioService.agregarUsuario(any(Usuario.class)))
                .thenThrow(new Exception("La contraseña debe tener al menos 8 caracteres..."));

        mockMvc.perform(post("/api/competidor/Registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroCompetidorDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error: La contraseña debe tener al menos 8 caracteres..."));
    }

    @Test
    @DisplayName("Caso 7: Error interno del servidor")
    void registrarCompetidor_ErrorInterno() throws Exception {
        when(rolService.obtenerPorNombre("Competidor")).thenReturn(rol);
        when(identificadorService.buscarIdentificador("COD123"))
                .thenThrow(new RuntimeException("Error BD conexión"));

        mockMvc.perform(post("/api/competidor/Registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroCompetidorDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error: Error BD conexión"));
    }
}
