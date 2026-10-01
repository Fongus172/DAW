package es.decroly.tienda_decroly.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class TiendaRestController {

    @GetMapping("/info")
    public String infoTienda() {
        return "Nombre: Tienda Decroly<br>Ubicación: Astillero<br>Horario: lunes a viernes de 9:00h a 14:00h";
    }

    @GetMapping("/porcentaje/{precio}")
    public String descuento(@PathVariable double precio,
                            @RequestParam(defaultValue = "10") double porcentaje) {
        double precioFinal = precio - (precio * porcentaje / 100);
        return "Precio original: " + precio + "€<br>" +
                "Descuento: " + porcentaje + "%<br>" +
                "Precio final: " + precioFinal + "€";
    }
}
