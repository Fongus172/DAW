package es.decroly.alquiler.controller;

import es.decroly.alquiler.model.CategoriaVehiculo;
import es.decroly.alquiler.model.Vehiculo;
import es.decroly.alquiler.service.AlquilerGestionServicio;
import es.decroly.alquiler.service.CategoriaVehiculoServicio;
import es.decroly.alquiler.service.VehiculoServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Tag(name = "Categorías de vehículos", description = "Operaciones relacionadas con las categorías")
@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaVehiculoControlador {

    private final CategoriaVehiculoServicio categoriaServicio;
    private final VehiculoServicio vehiculoServicio;
    private final AlquilerGestionServicio gestionServicio;

    @Operation(summary = "Listar categorías")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @GetMapping
    public List<CategoriaVehiculo> listar() {
        return categoriaServicio.listar();
    }

    @Operation(summary = "Buscar una categoría por ID")
    @ApiResponse(responseCode = "200", description = "Categoría encontrada")
    @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    @GetMapping("/{id}")
    public CategoriaVehiculo obtenerPorId(@PathVariable Long id) {
        return categoriaServicio.obtenerPorId(id);
    }

    // EJEMPLO EXAMEN - RECURSOS RELACIONADOS
    @Operation(summary = "Obtener los vehículos de una categoría")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    @GetMapping("/{id}/vehiculos")
    public List<Vehiculo> listarVehiculos(@PathVariable Long id) {
        return vehiculoServicio.listarPorCategoria(id);
    }

    @Operation(summary = "Crear una categoría")
    @ApiResponse(responseCode = "201", description = "Categoría creada correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "409", description = "Ya existe una categoría con ese nombre")
    @PostMapping
    public ResponseEntity<CategoriaVehiculo> crear(@RequestBody CategoriaVehiculo categoria) {
        CategoriaVehiculo creada = categoriaServicio.crear(categoria);
        URI direccion = URI.create("/api/categorias/" + creada.getId());
        return ResponseEntity.created(direccion).body(creada);
    }

    @Operation(summary = "Modificar una categoría")
    @ApiResponse(responseCode = "200", description = "Categoría modificada correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    @ApiResponse(responseCode = "409", description = "Ya existe una categoría con ese nombre")
    @PutMapping("/{id}")
    public CategoriaVehiculo modificar(@PathVariable Long id, @RequestBody CategoriaVehiculo categoria) {
        return categoriaServicio.modificar(id, categoria);
    }

    // EJEMPLO EXAMEN - REGLA AL BORRAR
    @Operation(summary = "Eliminar una categoría si no tiene vehículos")
    @ApiResponse(responseCode = "204", description = "Categoría eliminada correctamente")
    @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    @ApiResponse(responseCode = "409", description = "La categoría tiene vehículos asociados")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        gestionServicio.eliminarCategoriaSiNoTieneVehiculos(id);
        return ResponseEntity.noContent().build();
    }
}
