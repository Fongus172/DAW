package es.decroly.gimnasio.dto;

import lombok.Getter;
import lombok.Setter;
import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Setter
public class ActividadPeticionDto {

    @Schema(example = "Pilates")
    private String nombre;

    @Schema(example = "Laura Gómez")
    private String monitor;

    @Schema(example = "12")
    private int plazas;
}
