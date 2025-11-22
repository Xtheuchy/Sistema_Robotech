package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.modelo.Categoria;
import com.Robotech.BackEnd_Robotech.servicios.implementacion.CategoriaServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/categoria")
@CrossOrigin(origins = "*")
public class CategoriaController {
    @Autowired
    private CategoriaServiceImp categoriaService;
    List<Categoria> categorias;
    Categoria categoria;
    @GetMapping
    public ResponseEntity<List<Categoria>> listarCategorias() throws Exception{
        categorias = categoriaService.listarCategoria();
        return ResponseEntity.ok(categorias);
    }
    @PostMapping("/registrar")
    public ResponseEntity<Categoria> agregarCategoria(@RequestBody Categoria categoria) throws Exception {
        categoria = new Categoria(
                categoria.getNombre(),
                categoria.getDescripcion());
        categoria = categoriaService.agregarCategoria(categoria);
        return ResponseEntity.ok(categoria);
    }
}
