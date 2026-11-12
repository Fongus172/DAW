package es.decroly.tienda.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

// EJEMPLO EXAMEN - DTO PARA UN RESULTADO CALCULADO
// Este DTO no representa un objeto guardado. Reúne información calculada de una categoría y sus productos.
@Getter
@AllArgsConstructor
@Schema(description = "Resumen calculado de una categoría")
public class CategoriaResumenDto {

    @Schema(example = "1")
    private Long categoriaId;

    @Schema(example = "Informática")
    private String nombre;

    @Schema(example = "3")
    private int numeroProductos;

    @Schema(example = "25")
    private int stockTotal;

    @Schema(example = "1247.5")
    private double valorStock;
}
