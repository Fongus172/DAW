package es.decroly.prueba_offline.controller;

import es.decroly.prueba_offline.model.Prueba;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PruebaControlador {

    @GetMapping("/api/prueba")
    public Prueba prueba() {
        Prueba prueba = new Prueba();
        prueba.setId(1L);
        prueba.setNombre("FuncionaSinInternet");
        return prueba;
    }
}
