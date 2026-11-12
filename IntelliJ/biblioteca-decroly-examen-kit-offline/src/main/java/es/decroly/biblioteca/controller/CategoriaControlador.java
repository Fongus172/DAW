package es.decroly.biblioteca.controller;

import es.decroly.biblioteca.dto.CategoriaResumenDto;
import es.decroly.biblioteca.model.Categoria;
import es.decroly.biblioteca.model.Libro;
import es.decroly.biblioteca.service.BibliotecaGestionServicio;
import es.decroly.biblioteca.service.CategoriaServicio;
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

@Tag(name = "Categorías", description = "Operaciones relacionadas con las categorías")
@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaControlador {

    private final CategoriaServicio categoriaServicio;
    private final LibroServicio libroServicio;
    private final BibliotecaGestionServicio bibliotecaGestionServicio;

    @Operation(summary = "Obtener todas las categorías")
    @ApiResponse(responseCode = "200", description = "Lista de categorías obtenida correctamente")
    @GetMapping
    public List<Categoria> listar() {
        return categoriaServicio.listar();
    }

    @Operation(summary = "Buscar una categoría por ID")
    @ApiResponse(responseCode = "200", description = "Categoría encontrada")
    @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    @GetMapping("/{id}")
    public Categoria obtenerPorId(@PathVariable Long id) {
        return categoriaServicio.obtenerPorId(id);
    }

    // EJEMPLO EXAMEN - RESPONSEENTITY CREATED + LOCATION
    // El servidor indica con Location dónde se puede consultar la categoría recién creada.
    @Operation(summary = "Crear una categoría")
    @ApiResponse(responseCode = "201", description = "Categoría creada")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "409", description = "Ya existe una categoría con ese nombre")
    @PostMapping
    public ResponseEntity<Categoria> crear(@RequestBody Categoria categoria) {
        Categoria categoriaCreada = categoriaServicio.crear(categoria);
        URI direccion = URI.create("/api/categorias/" + categoriaCreada.getId());

        return ResponseEntity.created(direccion).body(categoriaCreada);
    }

    @Operation(summary = "Modificar una categoría")
    @ApiResponse(responseCode = "200", description = "Categoría modificada correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    @ApiResponse(responseCode = "409", description = "Ya existe otra categoría con ese nombre")
    @PutMapping("/{id}")
    public Categoria modificar(@PathVariable Long id, @RequestBody Categoria categoria) {
        return categoriaServicio.modificar(id, categoria);
    }

    // EJEMPLO EXAMEN - REGLA AL BORRAR
    // Antes de borrar una categoría se comprueba una condición de negocio:
    // si todavía tiene libros, se devuelve 409 Conflict.
    @Operation(summary = "Eliminar una categoría si no tiene libros")
    @ApiResponse(responseCode = "204", description = "Categoría eliminada correctamente")
    @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    @ApiResponse(responseCode = "409", description = "La categoría todavía tiene libros")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        bibliotecaGestionServicio.eliminarCategoriaSiEstaVacia(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Obtener los libros de una categoría")
    @ApiResponse(responseCode = "200", description = "Libros obtenidos correctamente")
    @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    @GetMapping("/{id}/libros")
    public List<Libro> listarLibrosPorCategoria(@PathVariable Long id) {
        return libroServicio.listarPorCategoria(id);
    }

    // EJEMPLO EXAMEN - RESULTADO CALCULADO CON DTO
    // Devuelve información calculada a partir de una categoría y sus libros.
    // No devuelve directamente una entidad guardada.
    @Operation(summary = "Obtener un resumen calculado de una categoría")
    @ApiResponse(responseCode = "200", description = "Resumen obtenido correctamente")
    @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    @GetMapping("/{id}/resumen")
    public CategoriaResumenDto obtenerResumen(
            @Parameter(description = "ID de la categoría", example = "1")
            @PathVariable Long id) {
        return bibliotecaGestionServicio.obtenerResumenCategoria(id);
    }
}
