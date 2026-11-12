package es.decroly.academia.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Matricula {

    @Schema(example = "1")
    private Long id;

    @Schema(example = "1")
    private Long alumnoId;

    @Schema(example = "1")
    private Long cursoId;

    @Schema(example = "true")
    private boolean activa;
}
