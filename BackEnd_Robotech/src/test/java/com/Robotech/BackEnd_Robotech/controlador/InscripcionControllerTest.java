package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.DTO.RegistroInscripcionDTO;
import com.Robotech.BackEnd_Robotech.modelo.*;
import com.Robotech.BackEnd_Robotech.repositorio.IInscripcionRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICompetidorServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IInscripcionServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IRobotServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ITorneoServicio;
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

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class InscripcionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IInscripcionServicio inscripcionServicio;

    @MockitoBean
    private ICompetidorServicio competidorServicio;

    @MockitoBean
    private IRobotServicio robotServicio;

    @MockitoBean
    private ITorneoServicio torneoServicio;

    @MockitoBean
    private IInscripcionRepositorio inscripcionRepositorio;

    @Autowired
    private ObjectMapper objectMapper;

    private RegistroInscripcionDTO registroInscripcionDTO;
    private Competidor competidor;
    private Torneo torneo;
    private Categoria categoria;
    private Robot robot;
    private Inscripcion inscripcion;

    @BeforeEach
    void setUp() {
        categoria = new Categoria();
        categoria.setId(1);
        categoria.setNombre("Peso Pesado");

        competidor = new Competidor();
        competidor.setId(1);
        competidor.setApodo("Juancho");
        competidor.setUsuario(new Usuario()); // evitar npes si se accede a usuario

        torneo = new Torneo();
        torneo.setId(1);
        torneo.setCategoria(categoria);
        torneo.setCantidad(10);

        robot = new Robot();
        robot.setId(1);
        robot.setCategoria(categoria); // Categoría coincide con torneo
        robot.setCompetidor(competidor);

        registroInscripcionDTO = new RegistroInscripcionDTO();
        registroInscripcionDTO.setCompetidorId(1);
        registroInscripcionDTO.setTorneoId(1);

        inscripcion = new Inscripcion();
        inscripcion.setId(1);
        inscripcion.setCompetidor(competidor);
        inscripcion.setTorneo(torneo);
    }

    @Test
    @DisplayName("Caso 1: Inscripción Exitosa")
    void registrarInscripcion_Exitoso() throws Exception {
        // Mocks para Controller validations
        when(competidorServicio.buscarPorId(1)).thenReturn(competidor);
        when(torneoServicio.obtenerPorId(1)).thenReturn(torneo);
        when(robotServicio.listarPorCompetidor(competidor)).thenReturn(List.of(robot)); // Tiene robot válido
        when(inscripcionRepositorio.findAlldByTorneo(torneo)).thenReturn(Collections.emptyList()); // No está inscrito

        // Mock servicio final
        when(inscripcionServicio.agregarInscripcion(any(RegistroInscripcionDTO.class))).thenReturn(inscripcion);

        mockMvc.perform(post("/api/inscripcion/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroInscripcionDTO)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Caso 2: Competidor Ya Inscrito")
    void registrarInscripcion_YaInscrito() throws Exception {
        when(competidorServicio.buscarPorId(1)).thenReturn(competidor);
        when(torneoServicio.obtenerPorId(1)).thenReturn(torneo);
        when(robotServicio.listarPorCompetidor(competidor)).thenReturn(List.of(robot));

        // Simular que ya está en la lista de inscritos
        when(inscripcionRepositorio.findAlldByTorneo(torneo)).thenReturn(List.of(inscripcion));

        mockMvc.perform(post("/api/inscripcion/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroInscripcionDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("El competidor ya se encuentra inscrito en este torneo."));
    }

    @Test
    @DisplayName("Caso 3: Sin Robot Válido")
    void registrarInscripcion_SinRobotValido() throws Exception {
        Robot robotInvalido = new Robot();
        robotInvalido.setCategoria(new Categoria()); // Categoría diferente (id=0 vs id=1)
        robotInvalido.getCategoria().setId(2);
        robotInvalido.getCategoria().setNombre("Peso Ligero");

        when(competidorServicio.buscarPorId(1)).thenReturn(competidor);
        when(torneoServicio.obtenerPorId(1)).thenReturn(torneo);
        when(inscripcionRepositorio.findAlldByTorneo(torneo)).thenReturn(Collections.emptyList());

        // Retorna lista de robots pero ninguno coincide con la categoría del torneo
        when(robotServicio.listarPorCompetidor(competidor)).thenReturn(List.of(robotInvalido));

        mockMvc.perform(post("/api/inscripcion/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroInscripcionDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content()
                        .string("El competidor no posee ningún robot registrado para la categoría: Peso Pesado"));
    }

    @Test
    @DisplayName("Caso 4: Torneo Lleno (Error Servicio)")
    void registrarInscripcion_TorneoLleno() throws Exception {
        // Setup OK para controller
        when(competidorServicio.buscarPorId(1)).thenReturn(competidor);
        when(torneoServicio.obtenerPorId(1)).thenReturn(torneo);
        when(robotServicio.listarPorCompetidor(competidor)).thenReturn(List.of(robot));
        when(inscripcionRepositorio.findAlldByTorneo(torneo)).thenReturn(Collections.emptyList());

        // Servicio lanza error
        when(inscripcionServicio.agregarInscripcion(any(RegistroInscripcionDTO.class)))
                .thenThrow(new Exception("El torneo ha alcanzado el número máximo de inscripciones."));

        mockMvc.perform(post("/api/inscripcion/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroInscripcionDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("El torneo ha alcanzado el número máximo de inscripciones."));
    }

    @Test
    @DisplayName("Caso 5: Cupo Club Lleno (Error Servicio)")
    void registrarInscripcion_CupoClubLleno() throws Exception {
        // Setup OK para controller
        when(competidorServicio.buscarPorId(1)).thenReturn(competidor);
        when(torneoServicio.obtenerPorId(1)).thenReturn(torneo);
        when(robotServicio.listarPorCompetidor(competidor)).thenReturn(List.of(robot));
        when(inscripcionRepositorio.findAlldByTorneo(torneo)).thenReturn(Collections.emptyList());

        // Servicio lanza error
        when(inscripcionServicio.agregarInscripcion(any(RegistroInscripcionDTO.class)))
                .thenThrow(new Exception("Cupo por club lleno: Ya hay 2 competidores del club..."));

        mockMvc.perform(post("/api/inscripcion/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroInscripcionDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Cupo por club lleno: Ya hay 2 competidores del club..."));
    }

    @Test
    @DisplayName("Caso 6: Periodo Descanso (Error Servicio)")
    void registrarInscripcion_PeriodoDescanso() throws Exception {
        // Setup OK para controller
        when(competidorServicio.buscarPorId(1)).thenReturn(competidor);
        when(torneoServicio.obtenerPorId(1)).thenReturn(torneo);
        when(robotServicio.listarPorCompetidor(competidor)).thenReturn(List.of(robot));
        when(inscripcionRepositorio.findAlldByTorneo(torneo)).thenReturn(Collections.emptyList());

        // Servicio lanza error
        when(inscripcionServicio.agregarInscripcion(any(RegistroInscripcionDTO.class)))
                .thenThrow(new Exception("Periodo de descanso obligatorio. Faltan 3 días para poder inscribirte."));

        mockMvc.perform(post("/api/inscripcion/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroInscripcionDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Periodo de descanso obligatorio. Faltan 3 días para poder inscribirte."));
    }
}
