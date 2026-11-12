package es.decroly.alquiler.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

// EJEMPLO EXAMEN - DTO DE RESPUESTA CALCULADO
// Este DTO no representa una entidad guardada. Solo agrupa información calculada para una respuesta concreta.
@Getter
@AllArgsConstructor
public class VehiculoResumenDto {

    private Long vehiculoId;
    private String matricula;
    private int totalAlquileres;
    private int alquileresActivos;
    private double ingresosTotales;
}
