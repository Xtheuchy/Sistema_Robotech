package com.Robotech.BackEnd_Robotech.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClubDTO {
    private int id;
    private int idPropietario;
    private String propietario;
    private String propietarioFoto;
    private String correo;
    private String telefono;
    private String clubNombre;
    private String direccion;
    private String logo;
    private String estado;
    private LocalDate Creado_en;
    private int puntos;

    public ClubDTO(int id, int idPropietario, String propietarioFoto, String propietario, String correo, String telefono, String clubNombre, String logo, String direccion, String estado, LocalDate creado_en) {
        this.id = id;
        this.idPropietario = idPropietario;
        this.propietarioFoto = propietarioFoto;
        this.propietario = propietario;
        this.correo = correo;
        this.telefono = telefono;
        this.clubNombre = clubNombre;
        this.logo = logo;
        this.direccion = direccion;
        this.estado = estado;
        Creado_en = creado_en;
    }
}
