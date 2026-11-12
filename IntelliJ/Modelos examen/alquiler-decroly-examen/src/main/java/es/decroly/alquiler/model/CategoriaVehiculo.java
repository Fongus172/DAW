package es.decroly.alquiler.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoriaVehiculo {

    @Schema(example = "1")
    private Long id;

    @Schema(example = "Turismo")
    private String nombre;

    @Schema(example = "Vehículos para uso diario y viajes")
    private String descripcion;
}
