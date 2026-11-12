package es.decroly.tienda.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

// El cliente indica qué producto quiere y cuántas unidades.
// El total no se recibe: lo calcula el servidor usando el precio actual del producto.
@Getter
@Setter
public class PedidoPeticionDto {

    @Schema(example = "1")
    private Long productoId;

    @Schema(example = "2")
    private int unidades;
}
