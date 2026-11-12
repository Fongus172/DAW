package es.decroly.tienda.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Categoria {

    @Schema(example = "1")
    private Long id;

    @Schema(example = "Informática")
    private String nombre;

    @Schema(example = "Productos de informática y accesorios")
    private String descripcion;
}
