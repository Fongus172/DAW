package es.decroly.biblioteca.controller;

import es.decroly.biblioteca.dto.LibroPeticionDto;
import es.decroly.biblioteca.model.Libro;
import es.decroly.biblioteca.service.LibroServicio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Libros", description = "Operaciones relacionadas con los libros")
@RestController
@RequestMapping("/api/libros")
@RequiredArgsConstructor
public class LibroControlador {

    private final LibroServicio libroServicio;

    @Operation(summary = "Obtener todos los libros")
    @ApiResponse(responseCode = "200", description = "Lista de libros obtenida correctamente")
    @GetMapping
    public List<Libro> listar(@RequestParam(required = false) String autor) {
        return libroServicio.listar(autor);
    }

    @Operation(summary = "Obtener todos los libros disponibles")
    @ApiResponse(responseCode = "200", description =
            "Lista de libros obtenida correctamente")
    @GetMapping("/disponibles")
    public List<Libro> listarDisponibles() {
        return libroServicio.listarDisponibles();
    }

    @Operation(summary = "Obtener un libro buscando su ID")
    @ApiResponse(responseCode = "200", description = "Libro encontrado")
    @ApiResponse(responseCode = "404", description = "Libro no encontrado")
    @GetMapping("/{id}")
    public Libro obtenerPorId(@PathVariable Long id) {
        return libroServicio.obtenerPorId(id);
    }

    @Operation(summary = "Crear un libro")
    @ApiResponse(responseCode = "201", description = "Libro creado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "409", description = "Ya existe un libro con ese ISBn")
    @PostMapping
    public ResponseEntity<Libro> crear(@RequestBody LibroPeticionDto libroPeticionDto) {
        Libro libroCreado = libroServicio.crear(libroPeticionDto);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(libroCreado);
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
