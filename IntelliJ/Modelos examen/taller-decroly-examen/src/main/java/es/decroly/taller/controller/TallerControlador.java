package es.decroly.taller.controller;

import es.decroly.taller.config.TallerPropiedades;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "Taller", description = "Información de configuración del taller")
@RestController
@RequiredArgsConstructor
public class TallerControlador {

    private final TallerPropiedades propiedades;

    // EJEMPLO EXAMEN - ENDPOINT QUE LEE application.properties
    @Operation(summary = "Obtener información de configuración del taller")
    @ApiResponse(responseCode = "200", description = "Información obtenida correctamente")
    @GetMapping("/api/taller/info")
    public Map<String, Object> obtenerInfo() {
        Map<String, Object> info = new HashMap<>();

        info.put("nombre", propiedades.getNombre());
        info.put("maxReparacionesActivas", propiedades.getMaxReparacionesActivas());

        return info;
    }
}
