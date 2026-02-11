package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.DTO.ResultadoEnfrentamientoDTO;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IEnfrentamientoServicio;
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

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class EnfrentamientoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IEnfrentamientoServicio enfrentamientoService;

    @Autowired
    private ObjectMapper objectMapper;

    @Nested
    @DisplayName("CU 18: Ingresar Puntajes")
    class IngresarPuntajesTests {

        private ResultadoEnfrentamientoDTO resultadoDTO;

        @BeforeEach
        void setUp() {
            resultadoDTO = new ResultadoEnfrentamientoDTO();
            resultadoDTO.setPuntaje1(10);
            resultadoDTO.setPuntaje2(8);
        }

        @Test
        @DisplayName("Caso 1: Registro Exitoso")
        void registrarResultadoEnfrentamiento_Exitoso() throws Exception {
            // Simulamos comportamiento exitoso del servicio (void)
            doNothing().when(enfrentamientoService).registrarResultadoEnfrentamiento(anyInt(), anyInt(), anyInt());

            mockMvc.perform(post("/api/enfrentamientos/resultado/1")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(resultadoDTO)))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Resultado registrado correctamente para el enfrentamiento con ID 1"));
        }

        @Test
        @DisplayName("Caso 2: Enfrentamiento No Encontrado (500 Internal Server Error)")
        void registrarResultadoEnfrentamiento_NoEncontrado() throws Exception {
            // Simulamos excepción cuando el ID no existe
            doThrow(new Exception("Enfrentamiento no encontrado"))
                    .when(enfrentamientoService).registrarResultadoEnfrentamiento(anyInt(), anyInt(), anyInt());

            mockMvc.perform(post("/api/enfrentamientos/resultado/999")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(resultadoDTO)))
                    .andExpect(status().isInternalServerError())
                    .andExpect(content().string("Error al registrar el resultado: Enfrentamiento no encontrado"));
        }

    }

    @Nested
    @DisplayName("CU 21: Generar Enfrentamientos")
    class GenerarEnfrentamientosTests {

        @Test
        @DisplayName("Caso 1: Generación Exitosa")
        void generarEnfrentamientos_Exitoso() throws Exception {
            // Simulamos comportamiento exitoso del servicio
            doNothing().when(enfrentamientoService).generarEnfrentamientos(anyInt());

            mockMvc.perform(post("/api/enfrentamientos/generar/1")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Enfrentamientos generados exitosamente para el torneo con ID 1"));
        }

        @Test
        @DisplayName("Caso 2: Error de Validación (e.g., sin competidores)")
        void generarEnfrentamientos_ErrorValidacion() throws Exception {
            // Simulamos error de lógica de negocio o validación
            doThrow(new Exception("No hay suficientes competidores para este torneo."))
                    .when(enfrentamientoService).generarEnfrentamientos(anyInt());

            mockMvc.perform(post("/api/enfrentamientos/generar/1")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isInternalServerError())
                    .andExpect(content().string("No hay suficientes competidores para este torneo."));
        }
    }
}
