package es.decroly.alquiler.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Alquiler {

    @Schema(example = "1")
    private Long id;

    @Schema(example = "1")
    private Long clienteId;

    @Schema(example = "1")
    private Long vehiculoId;

    @Schema(example = "5")
    private int dias;

    @Schema(example = "true")
    private boolean activo;

    @Schema(example = "227.5")
    private double precioTotal;
}
