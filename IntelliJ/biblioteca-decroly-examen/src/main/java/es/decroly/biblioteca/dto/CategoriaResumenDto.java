package es.decroly.biblioteca.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

// EJEMPLO EXAMEN - RESULTADO CALCULADO CON DTO
// Este DTO devuelve un resumen calculado. No representa directamente una entidad guardada.
@Getter
@AllArgsConstructor
@Schema(description = "Resumen calculado de una categoría")
public class CategoriaResumenDto {

    @Schema(example = "1")
    private Long categoriaId;

    @Schema(example = "Narrativa")
    private String nombre;

    @Schema(example = "4")
    private int numeroLibros;

    @Schema(example = "12")
    private int totalEjemplares;

    @Schema(example = "9")
    private int totalDisponibles;
}
