package com.Robotech.BackEnd_Robotech.servicios.interfaz;

import com.Robotech.BackEnd_Robotech.modelo.Enfrentamiento;
import com.Robotech.BackEnd_Robotech.modelo.Torneo;

import java.util.List;

public interface IEnfrentamientoServicio {
    public void generarEnfrentamientos(int torneoId) throws Exception;
    public void registrarResultadoEnfrentamiento(int enfrentamientoId, int puntaje1, int puntaje2) throws Exception;
    public void generarSiguienteRonda(int torneoId, int rondaActual) throws Exception;
}
