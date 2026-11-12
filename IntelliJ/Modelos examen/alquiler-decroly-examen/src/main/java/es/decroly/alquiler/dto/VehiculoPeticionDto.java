package es.decroly.alquiler.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

// Este DTO contiene los datos que el cliente de la API debe enviar para crear o modificar un vehículo.
// El campo disponible NO se recibe aquí: la propia aplicación lo controla según exista o no un alquiler activo.
@Getter
@Setter
public class VehiculoPeticionDto {

    @Schema(example = "1234ABC")
    private String matricula;

    @Schema(example = "Seat")
    private String marca;

    @Schema(example = "Leon")
    private String modelo;

    @Schema(example = "45.5")
    private double precioDia;

    @Schema(example = "1")
    private Long categoriaId;
}
