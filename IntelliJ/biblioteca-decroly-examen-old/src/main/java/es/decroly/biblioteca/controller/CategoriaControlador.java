package es.decroly.biblioteca.controller;

import es.decroly.biblioteca.model.Categoria;
import es.decroly.biblioteca.model.Libro;
import es.decroly.biblioteca.service.CategoriaServicio;
import es.decroly.biblioteca.service.LibroServicio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;

@Tag(name = "Categorías", description = "Operaciones relacionadas con las categorías")
@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaControlador {

    private final CategoriaServicio categoriaServicio;
    private final LibroServicio libroServicio;

    @Operation(summary = "Obtener todas las categorias")
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

    @Operation(summary = "Crear una categoría")
    @ApiResponse(responseCode = "201", description = "Categoría creada")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "409", description = "Ya existe una categoría con ese nombre")
    @PostMapping
    public ResponseEntity<Categoria> crear(@RequestBody Categoria categoria) {
        Categoria categoriaCreada = categoriaServicio.crear(categoria);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoriaCreada);
    }

    @Operation(summary = "Modificar una categoría")
    @ApiResponse(responseCode = "200", description = "Categoría modificada correctamente")
    @ApiResponse(responseCode = "400", description = "Datos  no válidos")
    @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    @ApiResponse(responseCode = "409", description = "Ya existe otra categoría con ese nombre")
    @PutMapping("/{id}")
    public Categoria modificar(@PathVariable Long id, @RequestBody Categoria categoria) {
        return categoriaServicio.modificar(id, categoria);
    }

    @Operation(summary = "Eliminar una categoría")
    @ApiResponse(responseCode = "204", description = "Categoría eliminada correctamente")
    @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        categoriaServicio.eliminar(id);

        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Obtener los libros de una categoría")
    @ApiResponse(responseCode = "200", description = "Libros obtenidos correctamente")
    @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    @GetMapping("/{id}/libros")
    public List<Libro> listarLibrosPorCategoria(@PathVariable Long id) {
        return libroServicio.listarPorCategoria(id);
    }
}
