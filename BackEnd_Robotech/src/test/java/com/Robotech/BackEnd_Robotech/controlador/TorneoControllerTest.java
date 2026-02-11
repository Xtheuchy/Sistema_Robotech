package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.DTO.RegistroTorneoDTO;
import com.Robotech.BackEnd_Robotech.modelo.Categoria;
import com.Robotech.BackEnd_Robotech.modelo.Sede;
import com.Robotech.BackEnd_Robotech.modelo.Torneo;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICategoriaServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ISedeServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ITorneoServicio;
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

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class TorneoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ITorneoServicio torneoServicio;

    @MockitoBean
    private ICategoriaServicio categoriaServicio;

    @MockitoBean
    private ISedeServicio sedeServicio;

    @MockitoBean
    private IUsuarioServicio usuarioServicio;

    @Autowired
    private ObjectMapper objectMapper;

    private RegistroTorneoDTO registroTorneoDTO;
    private Categoria categoria;
    private Sede sede;
    private Usuario juez;
    private Torneo torneo;

    @BeforeEach
    void setUp() {
        categoria = new Categoria();
        categoria.setNombre("Peso Pesado");
        categoria.setDescripcion("Robots de gran tamaño");

        sede = new Sede();
        sede.setNombreSede("Estadio Nacional");
        sede.setDireccion("Lima");

        juez = new Usuario();
        juez.setCorreo("juez@robotech.com");
        juez.setNombres("Juez Dredd");

        registroTorneoDTO = new RegistroTorneoDTO();
        registroTorneoDTO.setNombre_torneo("Gran Torneo RoboTech");
        registroTorneoDTO.setCategoria("Peso Pesado");
        registroTorneoDTO.setSede("Estadio Nacional");
        registroTorneoDTO.setCorreoJuez("juez@robotech.com");
        registroTorneoDTO.setFecha_inicio(LocalDate.now().plusDays(10));
        registroTorneoDTO.setFecha_final(LocalDate.now().plusDays(15));
        registroTorneoDTO.setCantidad(16);
        registroTorneoDTO.setEstado("PUBLICO");
        registroTorneoDTO.setDescripcion_torneo("Torneo anual");

        torneo = new Torneo();
        torneo.setId(1);
        torneo.setNombre(registroTorneoDTO.getNombre_torneo());
        torneo.setCategoria(categoria);
        torneo.setSede(sede);
        torneo.setJuez(juez);
        torneo.setFechaInicio(registroTorneoDTO.getFecha_inicio());
        torneo.setFechaFinal(registroTorneoDTO.getFecha_final());
        torneo.setEstado(registroTorneoDTO.getEstado());
        torneo.setCantidad(registroTorneoDTO.getCantidad());
        torneo.setDescripcion(registroTorneoDTO.getDescripcion_torneo());
    }

    @Test
    @DisplayName("Caso 1: Registro Exitoso")
    void registrarTorneo_Exitoso() throws Exception {
        when(categoriaServicio.verificarNombre(anyString())).thenReturn(true);
        when(sedeServicio.verificarNombreSede(anyString())).thenReturn(true);
        when(categoriaServicio.buscarPorNombre(anyString())).thenReturn(categoria);
        when(sedeServicio.buscarPorNombre(anyString())).thenReturn(sede);
        when(usuarioServicio.obtenerUsuarioPorCorreo(anyString())).thenReturn(juez);
        when(torneoServicio.agregarTorneo(any(Torneo.class))).thenReturn(torneo);

        mockMvc.perform(post("/api/torneo/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroTorneoDTO)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Caso 2: Categoría/Sede Vacía")
    void registrarTorneo_CamposVacios() throws Exception {
        registroTorneoDTO.setCategoria("");

        mockMvc.perform(post("/api/torneo/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroTorneoDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("El nombre de la categoría o sede no puede estar vacío"));
    }

    @Test
    @DisplayName("Caso 3: Categoría No Existe")
    void registrarTorneo_CategoriaNoExiste() throws Exception {
        when(categoriaServicio.verificarNombre(anyString())).thenReturn(false);

        mockMvc.perform(post("/api/torneo/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroTorneoDTO)))
                .andExpect(status().isNotFound())
                .andExpect(content().string("La categoría no existe"));
    }

    @Test
    @DisplayName("Caso 4: Sede No Existe")
    void registrarTorneo_SedeNoExiste() throws Exception {
        when(categoriaServicio.verificarNombre(anyString())).thenReturn(true);
        when(sedeServicio.verificarNombreSede(anyString())).thenReturn(false);

        mockMvc.perform(post("/api/torneo/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroTorneoDTO)))
                .andExpect(status().isNotFound())
                .andExpect(content().string("La sede no existe"));
    }

    @Test
    @DisplayName("Caso 5: Nombre Duplicado (Error Servicio)")
    void registrarTorneo_NombreDuplicado() throws Exception {
        when(categoriaServicio.verificarNombre(anyString())).thenReturn(true);
        when(sedeServicio.verificarNombreSede(anyString())).thenReturn(true);
        when(categoriaServicio.buscarPorNombre(anyString())).thenReturn(categoria);
        when(sedeServicio.buscarPorNombre(anyString())).thenReturn(sede);
        when(usuarioServicio.obtenerUsuarioPorCorreo(anyString())).thenReturn(juez);

        when(torneoServicio.agregarTorneo(any(Torneo.class)))
                .thenThrow(new Exception("Ya existe un torneo con el mismo nombre. Por favor, elija otro nombre."));

        mockMvc.perform(post("/api/torneo/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroTorneoDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content()
                        .string("Error: Ya existe un torneo con el mismo nombre. Por favor, elija otro nombre."));
    }

    @Test
    @DisplayName("Caso 6: Fecha Final Anterior a Inicio (Error Servicio)")
    void registrarTorneo_FechaInvalida() throws Exception {
        when(categoriaServicio.verificarNombre(anyString())).thenReturn(true);
        when(sedeServicio.verificarNombreSede(anyString())).thenReturn(true);
        when(categoriaServicio.buscarPorNombre(anyString())).thenReturn(categoria);
        when(sedeServicio.buscarPorNombre(anyString())).thenReturn(sede);
        when(usuarioServicio.obtenerUsuarioPorCorreo(anyString())).thenReturn(juez);

        when(torneoServicio.agregarTorneo(any(Torneo.class)))
                .thenThrow(new Exception("La fecha final no puede ser anterior a la fecha de inicio."));

        mockMvc.perform(post("/api/torneo/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroTorneoDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error: La fecha final no puede ser anterior a la fecha de inicio."));
    }

    @Test
    @DisplayName("Caso 7: Cruce de Fechas en Sede (Error Servicio)")
    void registrarTorneo_CruceFechas() throws Exception {
        when(categoriaServicio.verificarNombre(anyString())).thenReturn(true);
        when(sedeServicio.verificarNombreSede(anyString())).thenReturn(true);
        when(categoriaServicio.buscarPorNombre(anyString())).thenReturn(categoria);
        when(sedeServicio.buscarPorNombre(anyString())).thenReturn(sede);
        when(usuarioServicio.obtenerUsuarioPorCorreo(anyString())).thenReturn(juez);

        when(torneoServicio.agregarTorneo(any(Torneo.class)))
                .thenThrow(new Exception(
                        "Ya hay un torneo en curso en esta sede durante estas fechas. Intente con otra sede o fechas."));

        mockMvc.perform(post("/api/torneo/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroTorneoDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(
                        "Error: Ya hay un torneo en curso en esta sede durante estas fechas. Intente con otra sede o fechas."));
    }
}
