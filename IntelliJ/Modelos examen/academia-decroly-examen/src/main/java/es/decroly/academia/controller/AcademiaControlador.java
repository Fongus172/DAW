package es.decroly.academia.controller;

import es.decroly.academia.config.AcademiaPropiedades;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@Tag(name = "Academia", description = "Información general de la aplicación")
@RestController
@RequestMapping("/api/academia")
@RequiredArgsConstructor
public class AcademiaControlador {

    private final AcademiaPropiedades propiedades;

    // EJEMPLO EXAMEN - LEER CONFIGURACIÓN DESDE application.properties
    @Operation(summary = "Consultar la configuración de la academia")
    @GetMapping("/info")
    public Map<String, Object> info() {
        Map<String, Object> respuesta = new LinkedHashMap<>();
        respuesta.put("nombre", propiedades.getNombre());
        respuesta.put("maxMatriculasActivasAlumno", propiedades.getMaxMatriculasActivasAlumno());
        return respuesta;
    }
}
