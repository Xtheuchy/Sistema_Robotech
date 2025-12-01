package com.Robotech.BackEnd_Robotech.servicios.interfaz;

import com.Robotech.BackEnd_Robotech.modelo.Club;
import com.Robotech.BackEnd_Robotech.modelo.Identificador;

import java.util.List;

public interface IIdentificadorServicio {
    public Identificador registrarIdentificador(Identificador identificador) throws Exception;
    public Identificador buscarIdentificador(String id) throws Exception;
    public Identificador editarIdentificador(Identificador identificador) throws Exception;
    public List<Identificador> listarIdentificadorPorClub(Club club) throws Exception;
}
