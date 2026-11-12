package es.decroly.gimnasio.controller;

import es.decroly.gimnasio.config.GimnasioPropiedades;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "Gimnasio", description = "Información de configuracion del gimnasio")
@RestController
@RequiredArgsConstructor
public class GimnasioController {

    private final GimnasioPropiedades propiedades;

    @Operation(summary = "Obtener información del gimnasio")
    @ApiResponse(responseCode = "200", description = "Información obtenida correctamente")
    @GetMapping("/api/gimnasio/info")
    public Map<String, Object> obtenerInfo() {

        Map<String, Object> info = new HashMap<>();

        info.put("nombre", propiedades.getNombre());
        info.put("maxPlazas", propiedades.getMaxPlazas());

        return info;
    }
}
