package es.decroly.taller.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

// Este DTO representa los datos necesarios para crear o modificar una reparación.
// Usamos un String para el estado porque no necesitamos introducir enums para este ejercicio.
@Getter
@Setter
public class ReparacionPeticionDto {

    @Schema(example = "1")
    private Long vehiculoId;

    @Schema(example = "Cambio de pastillas de freno")
    private String descripcion;

    @Schema(example = "PENDIENTE", allowableValues = {"PENDIENTE", "EN_CURSO", "FINALIZADA"})
    private String estado;

    @Schema(example = "180.5")
    private double coste;
}
