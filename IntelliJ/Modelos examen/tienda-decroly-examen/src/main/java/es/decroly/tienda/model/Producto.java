package es.decroly.tienda.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Producto {

    @Schema(example = "1")
    private Long id;

    @Schema(example = "TEC-001")
    private String codigo;

    @Schema(example = "Teclado mecánico")
    private String nombre;

    @Schema(example = "49.9")
    private double precio;

    @Schema(example = "15")
    private int stock;

    @Schema(example = "1")
    private Long categoriaId;
}
