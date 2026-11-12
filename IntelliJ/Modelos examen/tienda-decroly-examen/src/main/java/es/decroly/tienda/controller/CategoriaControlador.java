package es.decroly.tienda.controller;

import es.decroly.tienda.dto.CategoriaResumenDto;
import es.decroly.tienda.model.Categoria;
import es.decroly.tienda.model.Producto;
import es.decroly.tienda.service.CategoriaServicio;
import es.decroly.tienda.service.ProductoServicio;
import es.decroly.tienda.service.TiendaGestionServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Tag(name = "Categorías", description = "Operaciones relacionadas con las categorías de productos")
@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaControlador {

    private final CategoriaServicio categoriaServicio;
    private final ProductoServicio productoServicio;
    private final TiendaGestionServicio tiendaGestionServicio;

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

    // EJEMPLO EXAMEN - POST CON 201 CREATED Y CABECERA LOCATION
    @Operation(summary = "Crear una categoría")
    @ApiResponse(responseCode = "201", description = "Categoría creada correctamente")
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

    // EJEMPLO EXAMEN - DELETE CON REGLA DE NEGOCIO
    // Si todavía hay productos en la categoría, TiendaGestionServicio lanza 409 Conflict.
    @Operation(summary = "Eliminar una categoría si no tiene productos")
    @ApiResponse(responseCode = "204", description = "Categoría eliminada correctamente")
    @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    @ApiResponse(responseCode = "409", description = "La categoría todavía tiene productos")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tiendaGestionServicio.eliminarCategoriaSiEstaVacia(id);
        return ResponseEntity.noContent().build();
    }

    // EJEMPLO EXAMEN - RECURSOS RELACIONADOS
    @Operation(summary = "Obtener los productos de una categoría")
    @ApiResponse(responseCode = "200", description = "Productos obtenidos correctamente")
    @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    @GetMapping("/{id}/productos")
    public List<Producto> listarProductosPorCategoria(@PathVariable Long id) {
        return productoServicio.listarPorCategoria(id);
    }

    // EJEMPLO EXAMEN - DTO CON DATOS CALCULADOS
    @Operation(summary = "Obtener un resumen calculado de una categoría")
    @ApiResponse(responseCode = "200", description = "Resumen obtenido correctamente")
    @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    @GetMapping("/{id}/resumen")
    public CategoriaResumenDto obtenerResumen(
            @Parameter(description = "ID de la categoría", example = "1")
            @PathVariable Long id) {
        return tiendaGestionServicio.obtenerResumenCategoria(id);
    }
}
