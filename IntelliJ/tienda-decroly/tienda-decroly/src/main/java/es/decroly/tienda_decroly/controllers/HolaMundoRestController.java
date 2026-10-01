package es.decroly.tienda_decroly.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HolaMundoRestController {

    @GetMapping("/saludo")
    public String saludo() {
        return "Hola Mundo desde la Tienda Decroly";
    }

    @GetMapping("/saludo/{nombre}")
    public String saludoPersonalizado(@PathVariable String nombre) {
        return "Hola " + nombre + ", bienvenido/a a la Tienda Decroly";
    }
    // Variable de ruta: http://localhost:8080/hola/Ana

    @GetMapping("/buscar")
    public String buscar(@RequestParam(defaultValue = "todo") String texto) {
        return "Buscando productos que contengan: " + texto;
    }

}
