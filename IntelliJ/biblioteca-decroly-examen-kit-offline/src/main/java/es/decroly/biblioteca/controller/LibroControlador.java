package es.decroly.biblioteca.controller;

import es.decroly.biblioteca.dto.LibroPeticionDto;
import es.decroly.biblioteca.model.Libro;
import es.decroly.biblioteca.service.LibroServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Tag(name = "Libros", description = "Operaciones relacionadas con los libros")
@RestController
@RequestMapping("/api/libros")
@RequiredArgsConstructor
public class LibroControlador {

    private final LibroServicio libroServicio;

    // EJEMPLO EXAMEN - VARIOS FILTROS OPCIONALES
    // Todos estos filtros usan la misma colección /api/libros y parámetros de consulta.
    // Se pueden usar por separado o combinar entre sí.
    // Ejemplos:
    // GET /api/libros?titulo=quijote
    // GET /api/libros?anio=1605
    // GET /api/libros?desde=2000
    // GET /api/libros?desde=2000&hasta=2020
    // GET /api/libros?autor=cervantes&titulo=quijote
    // GET /api/libros?limite=5
    // Si limite no se envía, defaultValue = "0" significa "sin límite".
    @Operation(summary = "Listar libros y aplicar filtros opcionales")
    @ApiResponse(responseCode = "200", description = "Lista de libros obtenida correctamente")
    @ApiResponse(responseCode = "400", description = "Algún filtro no es válido")
    @GetMapping
    public List<Libro> listar(
            @Parameter(description = "Texto que debe aparecer en el autor", example = "Cervantes")
            @RequestParam(required = false) String autor,

            @Parameter(description = "Texto que debe aparecer en el título", example = "Quijote")
            @RequestParam(required = false) String titulo,

            @Parameter(description = "Año exacto de publicación", example = "1605")
            @RequestParam(required = false) Integer anio,

            @Parameter(description = "Año mínimo de publicación", example = "2000")
            @RequestParam(required = false) Integer desde,

            @Parameter(description = "Año máximo de publicación", example = "2020")
            @RequestParam(required = false) Integer hasta,

            @Parameter(description = "Máximo de resultados. 0 significa sin límite", example = "5")
            @RequestParam(defaultValue = "0") int limite) {

        return libroServicio.filtrar(autor, titulo, anio, desde, hasta, limite);
    }

    @Operation(summary = "Obtener todos los libros disponibles")
    @ApiResponse(responseCode = "200", description = "Lista de libros obtenida correctamente")
    @GetMapping("/disponibles")
    public List<Libro> listarDisponibles() {
        return libroServicio.listarDisponibles();
    }

    // EJEMPLO EXAMEN - BUSCAR POR CAMPO ÚNICO
    // Igual que buscar por ID, pero usando otro campo que es único: el ISBN.
    @Operation(summary = "Obtener un libro por su ISBN")
    @ApiResponse(responseCode = "200", description = "Libro encontrado")
    @ApiResponse(responseCode = "400", description = "ISBN no válido")
    @ApiResponse(responseCode = "404", description = "Libro no encontrado")
    @GetMapping("/isbn/{isbn}")
    public Libro obtenerPorIsbn(
            @Parameter(description = "ISBN de 13 dígitos", example = "9781234567890")
            @PathVariable String isbn) {
        return libroServicio.obtenerPorIsbn(isbn);
    }

    @Operation(summary = "Obtener un libro buscando su ID")
    @ApiResponse(responseCode = "200", description = "Libro encontrado")
    @ApiResponse(responseCode = "404", description = "Libro no encontrado")
    @GetMapping("/{id}")
    public Libro obtenerPorId(@PathVariable Long id) {
        return libroServicio.obtenerPorId(id);
    }

    // EJEMPLO EXAMEN - RESPONSEENTITY CREATED + LOCATION
    // Un POST correcto devuelve 201, el objeto creado y la cabecera Location con su nueva URI.
    @Operation(summary = "Crear un libro")
    @ApiResponse(responseCode = "201", description = "Libro creado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "409", description = "Ya existe un libro con ese ISBN")
    @PostMapping
    public ResponseEntity<Libro> crear(@RequestBody LibroPeticionDto libroPeticionDto) {
        Libro libroCreado = libroServicio.crear(libroPeticionDto);
        URI direccion = URI.create("/api/libros/" + libroCreado.getId());

        return ResponseEntity.created(direccion).body(libroCreado);
    }

    @Operation(summary = "Modificar un libro")
    @ApiResponse(responseCode = "200", description = "Libro modificado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "404", description = "Libro no encontrado")
    @ApiResponse(responseCode = "409", description = "Ya existe un libro con ese ISBN")
    @PutMapping("/{id}")
    public Libro modificar(@PathVariable Long id, @RequestBody LibroPeticionDto libroPeticionDto) {
        return libroServicio.modificar(id, libroPeticionDto);
    }

    @Operation(summary = "Eliminar un libro")
    @ApiResponse(responseCode = "204", description = "Libro eliminado correctamente")
    @ApiResponse(responseCode = "404", description = "Libro no encontrado")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        libroServicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
