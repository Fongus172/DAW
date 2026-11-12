package es.decroly.taller.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

// Este DTO contiene los datos que el cliente envía para crear o modificar un vehículo.
// El ID no se recibe porque lo genera el servidor.
@Getter
@Setter
public class VehiculoPeticionDto {

    @Schema(example = "1234ABC")
    private String matricula;

    @Schema(example = "Toyota")
    private String marca;

    @Schema(example = "Corolla")
    private String modelo;

    @Schema(example = "1")
    private Long clienteId;
}
