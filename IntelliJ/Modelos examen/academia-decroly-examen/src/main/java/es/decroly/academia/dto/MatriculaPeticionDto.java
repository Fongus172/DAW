package es.decroly.academia.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

// Este DTO representa solamente los datos que el cliente debe enviar al crear o modificar una matrícula.
// El ID y el estado "activa" los controla la propia aplicación.
@Getter
@Setter
public class MatriculaPeticionDto {

    @Schema(example = "1")
    private Long alumnoId;

    @Schema(example = "1")
    private Long cursoId;
}
