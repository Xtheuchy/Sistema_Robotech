package com.Robotech.BackEnd_Robotech.modelo;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Entity
@NoArgsConstructor
@Table(name = "clubes", uniqueConstraints = {
        @UniqueConstraint(columnNames = "nombre"),
        @UniqueConstraint(columnNames = "direccion_fiscal")
})
public class Club {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private int id;
    @OneToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id",columnDefinition = "INT")
    private Usuario usuario;

    private String nombre;
    private String direccion_fiscal;
    private String telefono;
    private String logo;
    private String estado;

    private LocalDate creado_en;
    private int puntos;

    public Club(Usuario usuario,String  nombre,String direccion_fiscal,String telefono,String logo, String estado){
        this.usuario = usuario;
        this.nombre = nombre;
        this.direccion_fiscal = direccion_fiscal;
        this.telefono = telefono;
        this.logo = logo;
        this.estado = estado;
    }


}
