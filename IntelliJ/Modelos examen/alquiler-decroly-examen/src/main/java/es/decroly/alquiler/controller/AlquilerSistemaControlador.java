package es.decroly.alquiler.controller;

import es.decroly.alquiler.config.AlquilerPropiedades;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "Alquiler", description = "Información de configuración de la aplicación")
@RestController
@RequiredArgsConstructor
public class AlquilerSistemaControlador {

    private final AlquilerPropiedades propiedades;

    // EJEMPLO EXAMEN - ENDPOINT QUE LEE application.properties
    @Operation(summary = "Obtener información de configuración")
    @ApiResponse(responseCode = "200", description = "Información obtenida correctamente")
    @GetMapping("/api/alquiler/info")
    public Map<String, Object> obtenerInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("nombre", propiedades.getNombre());
        info.put("maxDias", propiedades.getMaxDias());
        return info;
    }
}
