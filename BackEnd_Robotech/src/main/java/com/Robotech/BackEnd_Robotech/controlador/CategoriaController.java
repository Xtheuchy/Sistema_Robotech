package com.Robotech.BackEnd_Robotech.controlador;

import com.Robotech.BackEnd_Robotech.modelo.Categoria;
import com.Robotech.BackEnd_Robotech.servicios.implementacion.CategoriaServiceImp;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICategoriaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/categoria")
@CrossOrigin(origins = "*")
public class CategoriaController {
    @Autowired
    private ICategoriaServicio categoriaService;
    List<Categoria> categorias;
    Categoria categoria;

    @GetMapping
    public ResponseEntity<?> listarCategorias() throws Exception{
        try {
            categorias = categoriaService.listarCategoria();
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }

    }

    @PostMapping("/registrar")
    public ResponseEntity<Categoria> agregarCategoria(@RequestBody Categoria categoria) throws Exception {
        categoria = new Categoria(
                categoria.getNombre(),
                categoria.getDescripcion(),
                categoria.getPeso_max(),
                categoria.getPeso_min(),
                categoria.getHabilidad());
        categoria = categoriaService.agregarCategoria(categoria);
        return ResponseEntity.ok(categoria);
    }

    //Modificar Categoria
    @PutMapping("/modificar/{id}")
    public ResponseEntity<?> modificarCategoria(@PathVariable int id, @RequestBody Categoria cat){
        try {
            categoria = categoriaService.buscarPorId(id);
            categoria.setNombre(cat.getNombre());
            categoria.setDescripcion(cat.getDescripcion());
            categoria.setHabilidad(cat.getHabilidad());
            categoria.setPeso_min(cat.getPeso_min());
            categoria.setPeso_max(cat.getPeso_max());
            return ResponseEntity.ok(categoriaService.modificarCategoria(categoria));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    //Eliminar Categoria
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminarCategoria(@PathVariable int id){
        try{
            categoriaService.eliminarPorId(id);
            return ResponseEntity.ok("¡Eliminado correctamente!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}
