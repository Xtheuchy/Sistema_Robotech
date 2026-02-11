package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.DTO.LoginDTO;
import com.Robotech.BackEnd_Robotech.modelo.Rol;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IClubServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICompetidorServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IMensajeServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IUsuarioServicio;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IUsuarioServicio usuarioServicio;

    @MockitoBean
    private ICompetidorServicio competidorServicio;

    @MockitoBean
    private IClubServicio clubServicio;

    @MockitoBean
    private IMensajeServicio mensajeServicio;

    private ObjectMapper objectMapper = new ObjectMapper();

    private Usuario adminUsuario;
    private Usuario clienteUsuario;
    private Rol adminRol;
    private Rol clienteRol;

    @BeforeEach
    void setUp() {
        adminRol = new Rol("Administrador");
        clienteRol = new Rol("Competidor");

        adminUsuario = new Usuario("Elvis Cayllahua", "ElvisCayllahua@robotech.com", "12345678", "encodedPassword",
                adminRol, "activo");
        adminUsuario.setId(1);

        clienteUsuario = new Usuario("Jhosep Garcia", "Jhosepgarcia@robotech.com", "87654321", "encodedPassword",
                clienteRol, "activo");
        clienteUsuario.setId(2);
    }

    // CASOS PARA loginAdmin()

    // Login Admin - Éxito con credenciales válidas
    @Test
    void loginAdmin_Exito_CamposValidos() throws Exception {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setCorreo("ElvisCayllahua@robotech.com");
        loginDTO.setPassword("admin123A?");

        when(usuarioServicio.obtenerUsuarioPorCorreo("ElvisCayllahua@robotech.com")).thenReturn(adminUsuario);
        when(usuarioServicio.verificarPassword("admin123A?", "encodedPassword")).thenReturn(true);

        mockMvc.perform(post("/auth/login/admin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonExpect -> {
                    // Verificamos que sea un objeto JSON con los datos del usuario
                })
                .andExpect(jsonPath("$.correo").value("ElvisCayllahua@robotech.com"));
    }

    // Login Admin - Fallo: Usuario no encontrado
    @Test
    void loginAdmin_Fallo_UsuarioNoEncontrado() throws Exception {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setCorreo("Elvis@gmail.com");
        loginDTO.setPassword("admin123A?");

        when(usuarioServicio.obtenerUsuarioPorCorreo("Elvis@gmail.com")).thenReturn(null);

        mockMvc.perform(post("/auth/login/admin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Usuario no encontrado"));
    }

    // Login Admin - Fallo: Contraseña incorrecta
    @Test
    void loginAdmin_Fallo_PasswordIncorrecto() throws Exception {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setCorreo("ElvisCayllahua@robotech.com");
        loginDTO.setPassword("admin?");

        when(usuarioServicio.obtenerUsuarioPorCorreo("ElvisCayllahua@robotech.com")).thenReturn(adminUsuario);
        when(usuarioServicio.verificarPassword("admin?", "encodedPassword")).thenReturn(false);

        mockMvc.perform(post("/auth/login/admin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Contraseña incorrecta"));
    }

    // Login Admin - Fallo: Campo usuario vacío
    @Test
    void loginAdmin_Fallo_UsuarioVacio() throws Exception {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setCorreo("");
        loginDTO.setPassword("admin123A?");

        when(usuarioServicio.obtenerUsuarioPorCorreo("")).thenReturn(null);

        mockMvc.perform(post("/auth/login/admin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Usuario no encontrado"));
    }

    // Login Admin - Fallo: Campo contraseña vacío
    @Test
    void loginAdmin_Fallo_PasswordVacio() throws Exception {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setCorreo("ElvisCayllahua@robotech.com");
        loginDTO.setPassword("");

        when(usuarioServicio.obtenerUsuarioPorCorreo("ElvisCayllahua@robotech.com")).thenReturn(adminUsuario);
        when(usuarioServicio.verificarPassword("", "encodedPassword")).thenReturn(false);

        mockMvc.perform(post("/auth/login/admin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Contraseña incorrecta"));
    }

    // CASOS PARA loginCliente()

    // Login Cliente - Éxito con credenciales válidas
    @Test
    void loginCliente_Exito_CamposValidos() throws Exception {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setCorreo("Jhosepgarcia@robotech.com");
        loginDTO.setPassword("dueñoclubA123=?");

        when(usuarioServicio.obtenerUsuarioPorCorreo("Jhosepgarcia@robotech.com")).thenReturn(clienteUsuario);
        when(usuarioServicio.verificarPassword("dueñoclubA123=?", "encodedPassword")).thenReturn(true);
        // El controlador requiere que se busque el competidor si el rol es Competidor
        com.Robotech.BackEnd_Robotech.modelo.Competidor mockCompetidor = new com.Robotech.BackEnd_Robotech.modelo.Competidor();
        mockCompetidor.setId(1);
        mockCompetidor.setApodo("Jhosep");
        mockCompetidor.setUsuario(clienteUsuario);
        when(competidorServicio.buscarCompetidorPorUsuario(clienteUsuario)).thenReturn(mockCompetidor);

        mockMvc.perform(post("/auth/login/cliente")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correo").value("Jhosepgarcia@robotech.com"));
    }

    // Login Cliente - Fallo: Usuario no encontrado
    @Test
    void loginCliente_Fallo_UsuarioNoEncontrado() throws Exception {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setCorreo("Jhose@robotech.com");
        loginDTO.setPassword("dueñoclubA123=?");

        when(usuarioServicio.obtenerUsuarioPorCorreo("Jhose@robotech.com")).thenReturn(null);

        mockMvc.perform(post("/auth/login/cliente")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Usuario no encontrado"));
    }

    // Login Cliente - Fallo: Contraseña incorrecta
    @Test
    void loginCliente_Fallo_PasswordIncorrecto() throws Exception {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setCorreo("Jhosegarcia@robotech.com");
        loginDTO.setPassword("admin?");

        // Simulamos que el usuario existe pero la contraseña es incorrecta
        Usuario usuario = new Usuario("Jhosep Garcia", "Jhosegarcia@robotech.com", "87654321", "encodedPassword",
                clienteRol, "activo");
        when(usuarioServicio.obtenerUsuarioPorCorreo("Jhosegarcia@robotech.com")).thenReturn(usuario);
        when(usuarioServicio.verificarPassword("admin?", "encodedPassword")).thenReturn(false);

        mockMvc.perform(post("/auth/login/cliente")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Contraseña incorrecta"));
    }

    // Login Cliente - Fallo: Campo usuario vacío
    @Test
    void loginCliente_Fallo_UsuarioVacio() throws Exception {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setCorreo("");
        loginDTO.setPassword("dueñoclubA123=?");

        when(usuarioServicio.obtenerUsuarioPorCorreo("")).thenReturn(null);

        mockMvc.perform(post("/auth/login/cliente")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Usuario no encontrado"));
    }

    // Login Cliente - Fallo: Campo contraseña vacío
    @Test
    void loginCliente_Fallo_PasswordVacio() throws Exception {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setCorreo("Jhosepgarcia@robotech.com");
        loginDTO.setPassword("");

        when(usuarioServicio.obtenerUsuarioPorCorreo("Jhosepgarcia@robotech.com")).thenReturn(clienteUsuario);
        when(usuarioServicio.verificarPassword("", "encodedPassword")).thenReturn(false);

        mockMvc.perform(post("/auth/login/cliente")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Contraseña incorrecta"));
    }
}
