package es.decroly.taller.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Cliente {

    @Schema(example = "1")
    private Long id;

    @Schema(example = "12345678A")
    private String dni;

    @Schema(example = "Ana Pérez")
    private String nombre;

    @Schema(example = "600123123")
    private String telefono;
}
