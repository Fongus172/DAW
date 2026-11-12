package es.decroly.biblioteca.model;

import lombok.Getter;
import lombok.Setter;
import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Setter
public class Libro {

    @Schema(example = "1")
    private Long id;

    @Schema(example = "9781234567890")
    private String isbn;

    @Schema(example = "El Quijote")
    private String titulo;

    @Schema(example = "Miguel de Cervantes")
    private String autor;

    @Schema(example = "1605")
    private Integer anioPublicacion;

    @Schema(example = "3")
    private int ejemplares;

    @Schema(example = "3")
    private int disponibles;

    @Schema(example = "1")
    private Long categoriaId;
}