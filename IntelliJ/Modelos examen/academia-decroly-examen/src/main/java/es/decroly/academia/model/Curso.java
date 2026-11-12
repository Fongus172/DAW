package es.decroly.academia.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Curso {

    @Schema(example = "1")
    private Long id;

    @Schema(example = "JAVA-01")
    private String codigo;

    @Schema(example = "Programación Java")
    private String nombre;

    @Schema(example = "20")
    private int plazasMaximas;

    @Schema(example = "180.0")
    private double precio;
}
