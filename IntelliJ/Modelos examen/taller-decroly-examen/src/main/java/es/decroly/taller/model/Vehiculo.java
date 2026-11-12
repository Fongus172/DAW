package es.decroly.taller.model;

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

    @Schema(example = "Toyota")
    private String marca;

    @Schema(example = "Corolla")
    private String modelo;

    @Schema(example = "1")
    private Long clienteId;
}
