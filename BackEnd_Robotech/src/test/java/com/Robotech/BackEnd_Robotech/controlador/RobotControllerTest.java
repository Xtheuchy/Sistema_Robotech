package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.DTO.RegistroRobotDTO;
import com.Robotech.BackEnd_Robotech.modelo.Categoria;
import com.Robotech.BackEnd_Robotech.modelo.Competidor;
import com.Robotech.BackEnd_Robotech.modelo.Robot;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICategoriaServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICompetidorServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IRobotServicio;
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

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class RobotControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IRobotServicio robotService;

    @MockitoBean
    private ICompetidorServicio competidorService;

    @MockitoBean
    private ICategoriaServicio categoriaService;

    @Autowired
    private ObjectMapper objectMapper;

    private RegistroRobotDTO registroRobotDTO;
    private Competidor competidor;
    private Categoria categoria;
    private Robot robot;

    @BeforeEach
    void setUp() {
        registroRobotDTO = new RegistroRobotDTO();
        registroRobotDTO.setNombre("Terminator");
        registroRobotDTO.setCategoria("Peso Pesado");
        registroRobotDTO.setPeso(50);
        registroRobotDTO.setFoto("url_foto");

        competidor = new Competidor();
        competidor.setId(1);
        competidor.setApodo("Juancho");

        categoria = new Categoria();
        categoria.setId(1);
        categoria.setNombre("Peso Pesado");
        categoria.setPeso_min(40);
        categoria.setPeso_max(60);

        robot = new Robot();
        robot.setId(1);
        robot.setNombre("Terminator");
        robot.setCategoria(categoria);
        robot.setCompetidor(competidor);
        robot.setPeso(50);
    }

    @Test
    @DisplayName("Caso 1: Registro Exitoso")
    void agregarRobot_Exitoso() throws Exception {
        when(categoriaService.buscarPorNombre("Peso Pesado")).thenReturn(categoria);
        when(competidorService.buscarPorId(1)).thenReturn(competidor);
        // Lista vacía de robots para el competidor, así no hay duplicados
        when(robotService.listarPorCompetidor(competidor)).thenReturn(Collections.emptyList());
        when(robotService.agregarRobot(any(Robot.class), eq(1))).thenReturn(robot);

        mockMvc.perform(post("/api/robot/registrar/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroRobotDTO)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Caso 2: Nombre de Robot Duplicado")
    void agregarRobot_NombreDuplicado() throws Exception {
        // Simulamos que el competidor ya tiene un robot con el mismo nombre
        List<Robot> robotsExistentes = new ArrayList<>();
        robotsExistentes.add(robot);

        when(categoriaService.buscarPorNombre("Peso Pesado")).thenReturn(categoria);
        when(competidorService.buscarPorId(1)).thenReturn(competidor);
        when(robotService.listarPorCompetidor(competidor)).thenReturn(robotsExistentes);

        mockMvc.perform(post("/api/robot/registrar/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroRobotDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error: Ya tiene un robot con ese nombre"));
    }

    @Test
    @DisplayName("Caso 3: Categoría Duplicada")
    void agregarRobot_CategoriaDuplicada() throws Exception {
        // Simulamos que el competidor ya tiene un robot en esa categoría (aunque con
        // otro nombre)
        Robot robotExistente = new Robot();
        robotExistente.setNombre("Otro Robot");
        robotExistente.setCategoria(categoria); // Misma categoría

        List<Robot> robotsExistentes = new ArrayList<>();
        robotsExistentes.add(robotExistente);

        when(categoriaService.buscarPorNombre("Peso Pesado")).thenReturn(categoria);
        when(competidorService.buscarPorId(1)).thenReturn(competidor);
        when(robotService.listarPorCompetidor(competidor)).thenReturn(robotsExistentes);

        mockMvc.perform(post("/api/robot/registrar/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroRobotDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error: Ya tienes un robots en esa categoria"));
    }

    @Test
    @DisplayName("Caso 4: Peso Cero")
    void agregarRobot_PesoCero() throws Exception {
        registroRobotDTO.setPeso(0);

        when(categoriaService.buscarPorNombre("Peso Pesado")).thenReturn(categoria);
        when(competidorService.buscarPorId(1)).thenReturn(competidor);
        when(robotService.listarPorCompetidor(competidor)).thenReturn(Collections.emptyList());

        mockMvc.perform(post("/api/robot/registrar/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroRobotDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error: El peso del robot no puede ser cero!!"));
    }

    @Test
    @DisplayName("Caso 5: Peso Menor al Mínimo")
    void agregarRobot_PesoMenorMinimo() throws Exception {
        // Mínimo es 40
        registroRobotDTO.setPeso(30);

        when(categoriaService.buscarPorNombre("Peso Pesado")).thenReturn(categoria);
        when(competidorService.buscarPorId(1)).thenReturn(competidor);
        when(robotService.listarPorCompetidor(competidor)).thenReturn(Collections.emptyList());

        mockMvc.perform(post("/api/robot/registrar/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroRobotDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(
                        "Error: el peso del robot no es válido para esta categoría. Asegúrate de que se ajuste a los requisitos de peso de la categoría."));
    }

    @Test
    @DisplayName("Caso 6: Peso Mayor al Máximo")
    void agregarRobot_PesoMayorMaximo() throws Exception {
        // Máximo es 60
        registroRobotDTO.setPeso(70);

        when(categoriaService.buscarPorNombre("Peso Pesado")).thenReturn(categoria);
        when(competidorService.buscarPorId(1)).thenReturn(competidor);
        when(robotService.listarPorCompetidor(competidor)).thenReturn(Collections.emptyList());

        mockMvc.perform(post("/api/robot/registrar/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroRobotDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(
                        "Error: el peso del robot no es válido para esta categoría. Asegúrate de que se ajuste a los requisitos de peso de la categoría."));
    }

    @Test
    @DisplayName("Caso 7: Categoría No Encontrada")
    void agregarRobot_CategoriaNoEncontrada() throws Exception {
        when(categoriaService.buscarPorNombre("Peso Pesado"))
                .thenThrow(new RuntimeException("Categoría no encontrada"));

        mockMvc.perform(post("/api/robot/registrar/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroRobotDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Categoría no encontrada"));
    }

    @Test
    @DisplayName("Caso 8: Competidor No Encontrado")
    void agregarRobot_CompetidorNoEncontrado() throws Exception {
        when(categoriaService.buscarPorNombre("Peso Pesado")).thenReturn(categoria);
        when(competidorService.buscarPorId(1)).thenThrow(new RuntimeException("Competidor no encontrado"));

        mockMvc.perform(post("/api/robot/registrar/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroRobotDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Competidor no encontrado"));
    }

    @Test
    @DisplayName("Caso 9: Error Interno")
    void agregarRobot_ErrorInterno() throws Exception {
        when(categoriaService.buscarPorNombre("Peso Pesado")).thenReturn(categoria);
        when(competidorService.buscarPorId(1)).thenReturn(competidor);
        when(robotService.listarPorCompetidor(competidor)).thenReturn(Collections.emptyList());
        when(robotService.agregarRobot(any(Robot.class), eq(1)))
                .thenThrow(new RuntimeException("Error en base de datos"));

        mockMvc.perform(post("/api/robot/registrar/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroRobotDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error en base de datos"));
    }
}
