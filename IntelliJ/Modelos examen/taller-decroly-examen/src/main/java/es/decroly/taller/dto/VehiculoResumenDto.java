package es.decroly.taller.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

// EJEMPLO EXAMEN - DTO PARA UN RESULTADO CALCULADO
// Este objeto no se guarda en ninguna lista. Se construye al consultar datos de un vehículo
// y de todas sus reparaciones para devolver un resumen ya calculado.
@Getter
@AllArgsConstructor
@Schema(description = "Resumen calculado de un vehículo y sus reparaciones")
public class VehiculoResumenDto {

    @Schema(example = "1")
    private Long vehiculoId;

    @Schema(example = "1234ABC")
    private String matricula;

    @Schema(example = "4")
    private int numeroReparaciones;

    @Schema(example = "2")
    private int reparacionesActivas;

    @Schema(example = "740.25")
    private double costeTotal;
}
