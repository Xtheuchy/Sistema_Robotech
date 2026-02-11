package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.DTO.RegistroDTO;
import com.Robotech.BackEnd_Robotech.modelo.Rol;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
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
public class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IUsuarioServicio usuarioServicio;

    @MockitoBean
    private IRolServicio rolServicio;

    private ObjectMapper objectMapper = new ObjectMapper();
    private Usuario usuarioAdmin;
    private Rol rolAdmin;

    @BeforeEach
    void setUp() {
        rolAdmin = new Rol("Administrador");
        usuarioAdmin = new Usuario("Ronaldin Romero Romero", "ronaldin@robotech.com", "74125896", "Robotech@123?", null,
                rolAdmin, "Activo");
        usuarioAdmin.setId(1);
    }

    // 1. registrarUsuario() - Campos válidos
    @Test
    @DisplayName("Caso 1: Registrar Usuario - Campos válidos")
    void registrarUsuario_Exito() throws Exception {
        RegistroDTO registroDTO = new RegistroDTO();
        registroDTO.setNombres("Ronaldin Romero Romero");
        registroDTO.setCorreo("ronaldin@robotech.com");
        registroDTO.setDni("74125896");
        registroDTO.setRol("Administrador");
        registroDTO.setPassword("Robotech@123?");
        registroDTO.setEstado("Activo");

        when(rolServicio.obtenerPorNombre("Administrador")).thenReturn(rolAdmin);
        when(usuarioServicio.agregarUsuario(any(Usuario.class))).thenReturn(usuarioAdmin);

        mockMvc.perform(post("/api/usuarios/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroDTO)))
                .andExpect(status().isCreated());
    }

    // 2. registrarUsuario() - Dominio inválido
    @Test
    @DisplayName("Caso 2: Registrar Usuario - Dominio inválido")
    void registrarUsuario_Fallo_DominioInvalido() throws Exception {
        RegistroDTO registroDTO = new RegistroDTO();
        registroDTO.setNombres("Ronaldin Romero Romero");
        registroDTO.setCorreo("ronaldin@gmail.com"); // Dominio inválido
        registroDTO.setDni("74125896");
        registroDTO.setRol("Administrador");
        registroDTO.setPassword("Robotech@123?");

        when(rolServicio.obtenerPorNombre("Administrador")).thenReturn(rolAdmin);
        // El servicio realiza la validación interna y lanza excepción
        when(usuarioServicio.agregarUsuario(any(Usuario.class)))
                .thenThrow(new Exception("El correo debe terminar con '@robotech.com'"));

        mockMvc.perform(post("/api/usuarios/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("El correo debe terminar con '@robotech.com'"));
    }

    // 3. registrarUsuario() - Usuario sin rol asignado
    @Test
    @DisplayName("Caso 3: Registrar Usuario - Falta Rol")
    void registrarUsuario_Fallo_SinRol() throws Exception {
        RegistroDTO registroDTO = new RegistroDTO();
        registroDTO.setNombres("Ronaldin Romero Romero");
        registroDTO.setCorreo("ronaldin@robotech.com");
        registroDTO.setDni("74125896");
        registroDTO.setRol(""); // Rol vacío
        registroDTO.setPassword("Robotech@123?");

        when(rolServicio.obtenerPorNombre("")).thenThrow(new Exception("Rol no encontrado"));

        mockMvc.perform(post("/api/usuarios/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroDTO)))
                .andExpect(status().isBadRequest());
    }

    // 4. registrarUsuario() - Correo ya registrado
    @Test
    @DisplayName("Caso 4: Registrar Usuario - Fallo: Correo ya registrado")
    void registrarUsuario_Fallo_CorreoRegistrado() throws Exception {
        RegistroDTO registroDTO = new RegistroDTO();
        registroDTO.setNombres("Ronaldin Romero Romero");
        registroDTO.setCorreo("ronaldin@robotech.com");
        registroDTO.setDni("74125896");
        registroDTO.setRol("Administrador");
        registroDTO.setPassword("Robotech@123?");

        when(rolServicio.obtenerPorNombre("Administrador")).thenReturn(rolAdmin);
        // Simulamos la excepción que lanza el servicio cuando `existsByCorreo` es true
        // internamente
        when(usuarioServicio.agregarUsuario(any(Usuario.class)))
                .thenThrow(new Exception("Error: El correo electrónico 'ronaldin@robotech.com' ya está en uso."));

        mockMvc.perform(post("/api/usuarios/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error: El correo electrónico 'ronaldin@robotech.com' ya está en uso."));
    }

    // 5. registrarUsuario() - DNI ya registrado
    @Test
    @DisplayName("Caso 5: Registrar Usuario - Fallo: DNI ya registrado")
    void registrarUsuario_Fallo_DniRegistrado() throws Exception {
        RegistroDTO registroDTO = new RegistroDTO();
        registroDTO.setNombres("Ronaldin Romero Romero");
        registroDTO.setCorreo("otro@robotech.com");
        registroDTO.setDni("74125896"); // DNI duplicado
        registroDTO.setRol("Administrador");
        registroDTO.setPassword("Robotech@123?");

        when(rolServicio.obtenerPorNombre("Administrador")).thenReturn(rolAdmin);
        // Simulamos la excepción que lanza el servicio cuando `existsByDni` es true
        // internamente
        when(usuarioServicio.agregarUsuario(any(Usuario.class)))
                .thenThrow(new Exception("Error: El DNI '74125896' ya está registrado."));

        mockMvc.perform(post("/api/usuarios/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error: El DNI '74125896' ya está registrado."));
    }

    // 6. registrarUsuario() - Contraseña inválida
    @Test
    @DisplayName("Caso 6: Registrar Usuario - Fallo: Contraseña inválida")
    void registrarUsuario_Fallo_PasswordInvalido() throws Exception {
        RegistroDTO registroDTO = new RegistroDTO();
        registroDTO.setNombres("Ronaldin Romero Romero");
        registroDTO.setCorreo("ronaldin@robotech.com");
        registroDTO.setDni("74125896");
        registroDTO.setRol("Administrador");
        registroDTO.setPassword("admin");

        when(rolServicio.obtenerPorNombre("Administrador")).thenReturn(rolAdmin);
        when(usuarioServicio.agregarUsuario(any(Usuario.class)))
                .thenThrow(new Exception("La contraseña debe tener al menos 8 caracteres..."));

        mockMvc.perform(post("/api/usuarios/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("La contraseña debe tener al menos 8 caracteres..."));
    }

    // 7. registrarUsuario() - DNI inválido (Longitud incorrecta)
    @Test
    @DisplayName("Caso 7: Registrar Usuario - Fallo: DNI inválido")
    void registrarUsuario_Fallo_DniInvalido() throws Exception {
        RegistroDTO registroDTO = new RegistroDTO();
        registroDTO.setNombres("Ronaldin Romero Romero");
        registroDTO.setCorreo("ronaldin@robotech.com");
        registroDTO.setDni("123"); // DNI inválido
        registroDTO.setRol("Administrador");
        registroDTO.setPassword("Robotech@123?");

        when(rolServicio.obtenerPorNombre("Administrador")).thenReturn(rolAdmin);
        when(usuarioServicio.agregarUsuario(any(Usuario.class)))
                .thenThrow(new Exception("El DNI debe tener exactamente 8 caracteres numéricos."));

        mockMvc.perform(post("/api/usuarios/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("El DNI debe tener exactamente 8 caracteres numéricos."));
    }
}
