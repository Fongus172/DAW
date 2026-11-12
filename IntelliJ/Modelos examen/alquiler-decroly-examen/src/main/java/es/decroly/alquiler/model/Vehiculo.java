package es.decroly.alquiler.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Vehiculo {

    @Schema(example = "1")
    private Long id;

    @Schema(example = "1234ABC")
    private String matricula;

    @Schema(example = "Seat")
    private String marca;

    @Schema(example = "Leon")
    private String modelo;

    @Schema(example = "45.5")
    private double precioDia;

    @Schema(example = "true")
    private boolean disponible;

    @Schema(example = "1")
    private Long categoriaId;
}
