package com.Robotech.BackEnd_Robotech.servicios.implementacion;

import com.Robotech.BackEnd_Robotech.modelo.Categoria;
import com.Robotech.BackEnd_Robotech.modelo.Torneo;
import com.Robotech.BackEnd_Robotech.repositorio.ICategoriaRepositorio;
import com.Robotech.BackEnd_Robotech.repositorio.ITorneoRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICategoriaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaServiceImp implements ICategoriaServicio {

    @Autowired private ICategoriaRepositorio categoriaRepositorio;
    @Autowired private ITorneoRepositorio torneoRepositorio;

    @Override
    public List<Categoria> listarCategoria() throws Exception {
        return categoriaRepositorio.findAll();
    }
    @Override
    public Categoria agregarCategoria(Categoria categoria) throws Exception {
        if(categoria.getNombre() == null || categoria.getNombre().isEmpty()){
            throw new Exception("El nombre de la categoría no puede estar vacío");
        }
        if (categoria.getHabilidad() == null || categoria.getHabilidad().isEmpty()){
            throw new Exception("La habilidad de la categoría no puede estar vacío");
        }
        return categoriaRepositorio.save(categoria);
    }

    @Override
    public Categoria modificarCategoria(Categoria categoria) throws Exception {
        return categoriaRepositorio.save(categoria);
    }

    @Override
    public Categoria buscarPorNombre(String categoria) throws Exception {
        return categoriaRepositorio.findByNombre(categoria);
    }

    @Override
    public boolean verificarNombre(String nombre) throws Exception {
        return categoriaRepositorio.existsByNombre(nombre);
    }

    @Override
    public Categoria buscarPorId(int id) throws Exception {
        return categoriaRepositorio.findById(id)
                .orElseThrow(() -> new Exception("Categoria no encontrado con ID: " + id));
    }

    @Override
    public void eliminarPorId(int id) throws Exception {
        Optional<Categoria> categoria = categoriaRepositorio.findById(id);
        if (categoria.isPresent()){
            Optional<Torneo> torneo = torneoRepositorio.findByCategoria(categoria);
            if (torneo.isPresent()){
                throw new Exception("La categoría, ya esta en uso");
            }
        }
        categoriaRepositorio.deleteById(id);
    }
}
