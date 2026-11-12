package es.decroly.biblioteca.dto;

import lombok.Getter;
import lombok.Setter;
import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Setter
public class LibroPeticionDto {

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

    @Schema(example = "1")
    private Long categoriaId;
}