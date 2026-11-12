package es.decroly.alquiler.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

// Datos necesarios para crear o modificar un alquiler.
// El precio total y el estado activo no los envía el usuario: se calculan y controlan en el Service.
@Getter
@Setter
public class AlquilerPeticionDto {

    @Schema(example = "1")
    private Long clienteId;

    @Schema(example = "1")
    private Long vehiculoId;

    @Schema(example = "5")
    private int dias;
}
