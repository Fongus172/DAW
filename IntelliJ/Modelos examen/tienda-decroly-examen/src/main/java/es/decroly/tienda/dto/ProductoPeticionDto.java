package es.decroly.tienda.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

// Este DTO contiene únicamente los datos que el cliente debe enviar para crear o modificar un producto.
// El ID no se incluye porque lo genera el servidor.
@Getter
@Setter
public class ProductoPeticionDto {

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
