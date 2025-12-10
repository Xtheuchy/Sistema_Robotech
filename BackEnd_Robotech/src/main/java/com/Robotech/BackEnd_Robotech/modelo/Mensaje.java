package com.Robotech.BackEnd_Robotech.modelo;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "mensajes")
public class Mensaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private LocalDateTime fechaMsj;
    @ManyToOne
    @JoinColumn(name = "Usuario_id", nullable = false, columnDefinition = "INT")
    private Usuario usuario;
    private String mensaje;

    public Mensaje(Usuario usuario, String mensaje){
        this.usuario = usuario;
        this.mensaje = mensaje;
    }
}
