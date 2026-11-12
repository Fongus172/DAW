package es.decroly.academia.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

// EJEMPLO EXAMEN - DTO PARA DEVOLVER UN RESULTADO CALCULADO
// No representa una entidad guardada. Se construye a partir de un curso y sus matrículas.
@Getter
@AllArgsConstructor
public class CursoResumenDto {

    private Long cursoId;
    private String codigo;
    private String nombre;
    private int plazasMaximas;
    private int matriculasActivas;
    private int plazasDisponibles;
    private double ingresosEstimados;
}
