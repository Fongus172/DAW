package es.decroly.tienda_decroly.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HolaMundoRestController {

    @GetMapping("/saludo/{nombre}")
    public String saludo(@PathVariable String nombre) {
        return "Hola " + nombre + ", bienvenido/a a la Tienda Decroly";
    }
    // Variable de ruta: http://localhost:8080/hola/Ana

}
