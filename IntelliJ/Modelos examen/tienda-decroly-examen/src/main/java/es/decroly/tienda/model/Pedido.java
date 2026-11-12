package es.decroly.tienda.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Pedido {

    @Schema(example = "1")
    private Long id;

    @Schema(example = "1")
    private Long productoId;

    @Schema(example = "2")
    private int unidades;

    @Schema(example = "99.8")
    private double total;
}
