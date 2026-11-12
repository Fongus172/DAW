package es.decroly.gimnasio.model;

import lombok.Getter;
import lombok.Setter;
import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Setter
public class Actividad {

    @Schema(example = "1")
    private Long id;

    @Schema(example = "Pilates")
    private String nombre;

    @Schema(example = "Laura Gómez")
    private String monitor;

    @Schema(example = "12")
    private int plazas;

    @Schema(example = "0")
    private int plazasLibres;
}
