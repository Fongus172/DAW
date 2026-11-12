package es.decroly.biblioteca.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import es.decroly.biblioteca.config.BibliotecaPropiedades;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Biblioteca", description = "Información de configuracion de la biblioteca")
@RestController
@RequiredArgsConstructor
public class BibliotecaControlador {

    private final BibliotecaPropiedades propiedades;

    @Operation(summary = "Obtener información de la biblioteca")
    @ApiResponse(responseCode = "200", description = "Información obtenida correctamente")
    @GetMapping("/api/biblioteca/info")
    public Map<String, Object> obtenerInfo() {

        Map<String, Object> info = new HashMap<>();

        info.put("nombre", propiedades.getNombre());
        info.put("maxPrestamos", propiedades.getMaxPrestamos());
        info.put("diasPrestamo", propiedades.getDiasPrestamo());

        return info;
    }
}
