package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.DTO.RegistroClubDTO;
import com.Robotech.BackEnd_Robotech.DTO.ValidarClubDTO;
import com.Robotech.BackEnd_Robotech.modelo.Club;
import com.Robotech.BackEnd_Robotech.modelo.Mensaje;
import com.Robotech.BackEnd_Robotech.modelo.Rol;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ClubControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockitoBean
        private IClubServicio clubService;

        @MockitoBean
        private ICompetidorServicio competidorService;

        @MockitoBean
        private IUsuarioServicio usuarioService;

        @MockitoBean
        private IRolServicio rolService;

        @MockitoBean
        private IIdentificadorServicio identificadorService;

        @MockitoBean
        private IMensajeServicio mensajeServicio;

        @Autowired
        private ObjectMapper objectMapper;

        private Club club;
        private Usuario usuario;
        private Rol rol;

        @BeforeEach
        void setUp() {
                // Setup general compartido
                rol = new Rol();
                rol.setId(2);
                rol.setNombre("Dueño de club");

                usuario = new Usuario();
                usuario.setId(1);
                usuario.setNombres("Juan Perez");
                usuario.setCorreo("juan@robotech.com");
                usuario.setRol(rol);
                usuario.setEstado("PENDIENTE");

                club = new Club();
                club.setId(1);
                club.setNombre("RoboClub");
                club.setUsuario(usuario);
                club.setEstado("PENDIENTE");
        }

        @Nested
        @DisplayName("CU 06: Registrar Club")
        class RegistrarClubTests {

                private RegistroClubDTO registroClubDTO;

                @BeforeEach
                void setUpRegistro() {
                        registroClubDTO = new RegistroClubDTO();
                        registroClubDTO.setNombres("Juan Perez");
                        registroClubDTO.setCorreo("juan@robotech.com");
                        registroClubDTO.setDni("12345678");
                        registroClubDTO.setPassword("Password123!");
                        registroClubDTO.setNombreClub("RoboClub");
                        registroClubDTO.setDireccion_fiscal("Av. Siempre Viva 123");
                        registroClubDTO.setTelefono("987654321");
                        registroClubDTO.setFoto("url_foto");
                        registroClubDTO.setLogo("url_logo");
                }

                @Test
                @DisplayName("Caso 1: Registro con datos válidos")
                void registrarClub_Exitoso() throws Exception {
                        when(rolService.obtenerPorNombre("Dueño de club")).thenReturn(rol);
                        when(clubService.registrarClub(any(RegistroClubDTO.class), any(Usuario.class)))
                                        .thenReturn(club);

                        mockMvc.perform(post("/api/club/registrar")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(registroClubDTO)))
                                        .andExpect(status().isCreated())
                                        .andExpect(jsonPath("$.nombre").value(registroClubDTO.getNombreClub()));
                }

                @Test
                @DisplayName("Caso 2: Nombre de club duplicado")
                void registrarClub_NombreDuplicado() throws Exception {
                        when(rolService.obtenerPorNombre("Dueño de club")).thenReturn(rol);
                        when(clubService.registrarClub(any(RegistroClubDTO.class), any(Usuario.class)))
                                        .thenThrow(new Exception(
                                                        "El nombre del club es demasiado similar a uno ya registrado."));

                        mockMvc.perform(post("/api/club/registrar")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(registroClubDTO)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(content().string(
                                                        "El nombre del club es demasiado similar a uno ya registrado."));
                }

                @Test
                @DisplayName("Caso 3: Dirección fiscal duplicada")
                void registrarClub_DireccionDuplicada() throws Exception {
                        when(rolService.obtenerPorNombre("Dueño de club")).thenReturn(rol);
                        when(clubService.registrarClub(any(RegistroClubDTO.class), any(Usuario.class)))
                                        .thenThrow(new Exception(
                                                        "La dirección del club es demasiado similar a uno ya registrado."));

                        mockMvc.perform(post("/api/club/registrar")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(registroClubDTO)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(content().string(
                                                        "La dirección del club es demasiado similar a uno ya registrado."));
                }

                @Test
                @DisplayName("Caso 4: Teléfono duplicado")
                void registrarClub_TelefonoDuplicado() throws Exception {
                        when(rolService.obtenerPorNombre("Dueño de club")).thenReturn(rol);
                        when(clubService.registrarClub(any(RegistroClubDTO.class), any(Usuario.class)))
                                        .thenThrow(new Exception("El telefono del club es igual a uno ya registrado"));

                        mockMvc.perform(post("/api/club/registrar")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(registroClubDTO)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(content()
                                                        .string("El telefono del club es igual a uno ya registrado"));
                }

                @Test
                @DisplayName("Caso 5: Correo con dominio inválido")
                void registrarClub_CorreoInvalido() throws Exception {
                        registroClubDTO.setCorreo("juan@gmail.com");
                        when(rolService.obtenerPorNombre("Dueño de club")).thenReturn(rol);
                        when(clubService.registrarClub(any(RegistroClubDTO.class), any(Usuario.class)))
                                        .thenThrow(new Exception("El correo debe terminar con '@robotech.com'"));

                        mockMvc.perform(post("/api/club/registrar")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(registroClubDTO)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(content().string("El correo debe terminar con '@robotech.com'"));
                }

                @Test
                @DisplayName("Caso 6: Contraseña débil")
                void registrarClub_PasswordDebil() throws Exception {
                        registroClubDTO.setPassword("123");
                        when(rolService.obtenerPorNombre("Dueño de club")).thenReturn(rol);
                        when(clubService.registrarClub(any(RegistroClubDTO.class), any(Usuario.class)))
                                        .thenThrow(new Exception("La contraseña debe tener al menos 8 caracteres..."));

                        mockMvc.perform(post("/api/club/registrar")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(registroClubDTO)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(content()
                                                        .string("La contraseña debe tener al menos 8 caracteres..."));
                }

                @Test
                @DisplayName("Caso 7: DNI con longitud incorrecta")
                void registrarClub_DniInvalido() throws Exception {
                        registroClubDTO.setDni("123");
                        when(rolService.obtenerPorNombre("Dueño de club")).thenReturn(rol);
                        when(clubService.registrarClub(any(RegistroClubDTO.class), any(Usuario.class)))
                                        .thenThrow(new Exception(
                                                        "El DNI debe tener exactamente 8 caracteres numéricos."));

                        mockMvc.perform(post("/api/club/registrar")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(registroClubDTO)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(content().string(
                                                        "El DNI debe tener exactamente 8 caracteres numéricos."));
                }
        }

        @Nested
        @DisplayName("CU 07: Validar Club")
        class ValidarClubTests {

                private ValidarClubDTO validarClubDTO;

                @BeforeEach
                void setUpValidacion() {
                        validarClubDTO = new ValidarClubDTO();
                        validarClubDTO.setId(1);
                }

                @Test
                @DisplayName("Caso 1: Permitir club (Activar)")
                void validarClub_Permitir() throws Exception {
                        validarClubDTO.setAccion("permitir");

                        when(clubService.buscarPorID(1)).thenReturn(club);
                        when(clubService.modificarClub(any(Club.class))).thenReturn(club);

                        mockMvc.perform(put("/api/club/validacion")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(validarClubDTO)))
                                        .andExpect(status().isOk())
                                        .andExpect(content().string("Club Activo Correctamente"));
                }

                @Test
                @DisplayName("Caso 2: Rechazar club con mensaje")
                void validarClub_RechazarConMensaje() throws Exception {
                        validarClubDTO.setAccion("rechazar");
                        validarClubDTO.setMensaje("Documentación incompleta");

                        when(clubService.buscarPorID(1)).thenReturn(club);
                        when(mensajeServicio.registrarMensaje(any(Mensaje.class))).thenReturn(new Mensaje());
                        when(clubService.modificarClub(any(Club.class))).thenReturn(club);

                        mockMvc.perform(put("/api/club/validacion")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(validarClubDTO)))
                                        .andExpect(status().isAccepted())
                                        .andExpect(content().string("Club Rechazado correctamente."));
                }

                @Test
                @DisplayName("Caso 3: Rechazar club sin mensaje")
                void validarClub_RechazarSinMensaje() throws Exception {
                        validarClubDTO.setAccion("rechazar");
                        validarClubDTO.setMensaje(""); // Mensaje vacío

                        when(clubService.buscarPorID(1)).thenReturn(club);

                        mockMvc.perform(put("/api/club/validacion")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(validarClubDTO)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(content().string(
                                                        "Necesitar ingresar la razón por la cual se rechaza el club"));
                }

                @Test
                @DisplayName("Caso 4: Club no encontrado")
                void validarClub_NoEncontrado() throws Exception {
                        validarClubDTO.setId(999);
                        when(clubService.buscarPorID(999)).thenReturn(null);

                        mockMvc.perform(put("/api/club/validacion")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(validarClubDTO)))
                                        .andExpect(status().isNotFound())
                                        .andExpect(content().string("Club no encontrado"));
                }
        }
}
