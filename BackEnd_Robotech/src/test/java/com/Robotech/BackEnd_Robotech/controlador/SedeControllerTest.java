package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.modelo.Sede;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ISedeServicio;
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
public class SedeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ISedeServicio sedeServicio;

    @Autowired
    private ObjectMapper objectMapper;

    private Sede sede;

    @BeforeEach
    void setUp() {
        sede = new Sede();
        sede.setNombreSede("Estadio Nacional");
        sede.setDireccion("Av. Paseo de la República");
        sede.setCapacidad(50000);
    }

    @Test
    @DisplayName("Caso 1: Registro Exitoso")
    void registrarSede_Exitoso() throws Exception {
        when(sedeServicio.agregarSede(any(Sede.class))).thenReturn(sede);

        mockMvc.perform(post("/api/sede/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sede)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Caso 2: Nombre Vacío")
    void registrarSede_NombreVacio() throws Exception {
        sede.setNombreSede("");
        when(sedeServicio.agregarSede(any(Sede.class))).thenThrow(new Exception("El nombre de la sede no puede estar vacío"));

        mockMvc.perform(post("/api/sede/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sede)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("El nombre de la sede no puede estar vacío"));
    }

    @Test
    @DisplayName("Caso 3: Dirección Vacía")
    void registrarSede_DireccionVacia() throws Exception {
        sede.setDireccion("");
        when(sedeServicio.agregarSede(any(Sede.class))).thenThrow(new Exception("La dirección de la sede no puede estar vacío"));

        mockMvc.perform(post("/api/sede/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sede)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("La dirección de la sede no puede estar vacío"));
    }

    @Test
    @DisplayName("Caso 4: Nombre Duplicado")
    void registrarSede_NombreDuplicado() throws Exception {
        when(sedeServicio.agregarSede(any(Sede.class))).thenThrow(new RuntimeException("Error: El nombre de la sede ya está en uso"));

        mockMvc.perform(post("/api/sede/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sede)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Error: El nombre de la sede ya está en uso"));
    }

    @Test
    @DisplayName("Caso 5: Dirección Duplicada")
    void registrarSede_DireccionDuplicada() throws Exception {
        when(sedeServicio.agregarSede(any(Sede.class))).thenThrow(new RuntimeException("Error: La dirección ya está registrada para otra sede"));

        mockMvc.perform(post("/api/sede/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sede)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Error: La dirección ya está registrada para otra sede"));
    }

    @Test
    @DisplayName("Caso 6: Error Interno")
    void registrarSede_ErrorInterno() throws Exception {
        when(sedeServicio.agregarSede(any(Sede.class))).thenThrow(new RuntimeException("Error inesperado"));

        mockMvc.perform(post("/api/sede/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sede)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Error inesperado"));
    }
}
