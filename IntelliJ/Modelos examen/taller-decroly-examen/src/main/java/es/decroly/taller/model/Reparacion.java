package es.decroly.taller.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Reparacion {

    @Schema(example = "1")
    private Long id;

    @Schema(example = "1")
    private Long vehiculoId;

    @Schema(example = "Cambio de pastillas de freno")
    private String descripcion;

    @Schema(example = "PENDIENTE", allowableValues = {"PENDIENTE", "EN_CURSO", "FINALIZADA"})
    private String estado;

    @Schema(example = "180.5")
    private double coste;
}
