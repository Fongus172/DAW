package es.decroly.biblioteca.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Categoria {

    @Schema(example = "1")
    private Long id;

    @Schema(example = "Narrativa")
    private String nombre;

    @Schema(example = "Novelas y otros libros narrativos")
    private String descripcion;
}