package com.Robotech.BackEnd_Robotech.controlador;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/")
    public String home(){
        return "¡Bienvenido al API de Robotech!";
    }
}
