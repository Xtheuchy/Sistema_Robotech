package com.Robotech.BackEnd_Robotech.servicios.interfaz;

import com.Robotech.BackEnd_Robotech.modelo.Categoria;

import java.util.List;

public interface ICategoriaServicio {
    public List<Categoria> listarCategoria() throws Exception;
    public Categoria agregarCategoria(Categoria categoria) throws Exception;
    public Categoria modificarCategoria(Categoria categoria) throws Exception;
    public Categoria buscarPorNombre(String categoria) throws Exception;
    public boolean verificarNombre(String nombre) throws Exception;
    public Categoria buscarPorId(int id) throws Exception;
    public void eliminarPorId(int id) throws Exception;
}
