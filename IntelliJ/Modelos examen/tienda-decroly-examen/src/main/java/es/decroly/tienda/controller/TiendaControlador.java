package es.decroly.tienda.controller;

import es.decroly.tienda.config.TiendaPropiedades;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "Tienda", description = "Información de configuración de la tienda")
@RestController
@RequiredArgsConstructor
public class TiendaControlador {

    private final TiendaPropiedades propiedades;

    // EJEMPLO EXAMEN - ENDPOINT DE INFORMACIÓN LEÍDA DESDE application.properties
    @Operation(summary = "Obtener información de configuración de la tienda")
    @ApiResponse(responseCode = "200", description = "Información obtenida correctamente")
    @GetMapping("/api/tienda/info")
    public Map<String, Object> obtenerInfo() {
        Map<String, Object> info = new HashMap<>();

        info.put("nombre", propiedades.getNombre());
        info.put("iva", propiedades.getIva());
        info.put("maxUnidadesPedido", propiedades.getMaxUnidadesPedido());

        return info;
    }
}
