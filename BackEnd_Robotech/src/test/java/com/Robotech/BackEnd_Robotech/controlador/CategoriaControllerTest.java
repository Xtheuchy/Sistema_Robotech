package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.modelo.Categoria;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICategoriaServicio;
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
public class CategoriaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ICategoriaServicio categoriaService;

    @Autowired
    private ObjectMapper objectMapper;

    private Categoria categoria;

    @BeforeEach
    void setUp() {
        categoria = new Categoria();
        categoria.setNombre("Peso Ligero");
        categoria.setDescripcion("Robots de hasta 5kg");
        categoria.setHabilidad("Velocidad");
        categoria.setPeso_min(1);
        categoria.setPeso_max(5);
    }

    @Test
    @DisplayName("Caso 1: Registro Exitoso")
    void agregarCategoria_Exitoso() throws Exception {
        when(categoriaService.agregarCategoria(any(Categoria.class))).thenReturn(categoria);

        mockMvc.perform(post("/api/categoria/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(categoria)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Caso 2: Nombre Vacío")
    void agregarCategoria_NombreVacio() throws Exception {
        categoria.setNombre("");
        when(categoriaService.agregarCategoria(any(Categoria.class)))
                .thenThrow(new Exception("El nombre de la categoría no puede estar vacío"));

        mockMvc.perform(post("/api/categoria/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(categoria)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("El nombre de la categoría no puede estar vacío"));
    }

    @Test
    @DisplayName("Caso 3: Habilidad Vacía")
    void agregarCategoria_HabilidadVacia() throws Exception {
        categoria.setHabilidad("");
        when(categoriaService.agregarCategoria(any(Categoria.class)))
                .thenThrow(new Exception("La habilidad de la categoría no puede estar vacío"));

        mockMvc.perform(post("/api/categoria/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(categoria)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("La habilidad de la categoría no puede estar vacío"));
    }

    @Test
    @DisplayName("Caso 4: Nombre Duplicado")
    void agregarCategoria_NombreDuplicado() throws Exception {
        when(categoriaService.agregarCategoria(any(Categoria.class)))
                .thenThrow(new RuntimeException("El nombre de la categoría ya existe"));

        mockMvc.perform(post("/api/categoria/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(categoria)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("El nombre de la categoría ya existe"));
    }

    @Test
    @DisplayName("Caso 5: Habilidad Duplicada")
    void agregarCategoria_HabilidadDuplicada() throws Exception {
        when(categoriaService.agregarCategoria(any(Categoria.class)))
                .thenThrow(new RuntimeException("La habilidad ya está registrada en otra categoría"));

        mockMvc.perform(post("/api/categoria/registrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(categoria)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("La habilidad ya está registrada en otra categoría"));
    }
}
