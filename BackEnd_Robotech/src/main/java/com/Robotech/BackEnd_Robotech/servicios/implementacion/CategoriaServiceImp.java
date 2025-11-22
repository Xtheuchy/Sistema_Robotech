package com.Robotech.BackEnd_Robotech.servicios.implementacion;

import com.Robotech.BackEnd_Robotech.modelo.Categoria;
import com.Robotech.BackEnd_Robotech.repositorio.ICategoriaRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICategoriaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaServiceImp implements ICategoriaServicio {
    @Autowired
    private ICategoriaRepositorio categoriaRepositorio;

    @Override
    public List<Categoria> listarCategoria() throws Exception {
        return categoriaRepositorio.findAll();
    }
    @Override
    public Categoria agregarCategoria(Categoria categoria) throws Exception {
        return categoriaRepositorio.save(categoria);
    }

    @Override
    public Categoria buscarPorNombre(String categoria) throws Exception {
        return categoriaRepositorio.findByNombre(categoria);
    }

    @Override
    public Categoria buscarPorId(int id) throws Exception {
        return null;
    }

    @Override
    public void eliminarPorId(int id) throws Exception {
    }
}
