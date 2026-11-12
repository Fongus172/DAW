package es.decroly.taller.controller;

import es.decroly.taller.dto.ReparacionPeticionDto;
import es.decroly.taller.model.Reparacion;
import es.decroly.taller.service.ReparacionServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Tag(name = "Reparaciones", description = "Operaciones relacionadas con las reparaciones")
@RestController
@RequestMapping("/api/reparaciones")
@RequiredArgsConstructor
public class ReparacionControlador {

    private final ReparacionServicio reparacionServicio;

    // EJEMPLO EXAMEN - FILTROS OPCIONALES + RANGO NUMÉRICO + defaultValue
    // GET /api/reparaciones?estado=PENDIENTE
    // GET /api/reparaciones?costeMin=100&costeMax=500
    // GET /api/reparaciones?vehiculoId=1&limite=3
    @Operation(summary = "Listar reparaciones y aplicar filtros opcionales")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @ApiResponse(responseCode = "400", description = "Algún filtro no es válido")
    @ApiResponse(responseCode = "404", description = "El vehículo usado como filtro no existe")
    @GetMapping
    public List<Reparacion> listar(
            @Parameter(description = "Estado de la reparación", example = "PENDIENTE")
            @RequestParam(required = false) String estado,

            @Parameter(description = "Coste mínimo", example = "100")
            @RequestParam(required = false) Double costeMin,

            @Parameter(description = "Coste máximo", example = "500")
            @RequestParam(required = false) Double costeMax,

            @Parameter(description = "ID del vehículo", example = "1")
            @RequestParam(required = false) Long vehiculoId,

            @Parameter(description = "Máximo de resultados. 0 significa sin límite", example = "3")
            @RequestParam(defaultValue = "0") int limite) {

        return reparacionServicio.filtrar(estado, costeMin, costeMax, vehiculoId, limite);
    }

    @Operation(summary = "Obtener las reparaciones activas")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @GetMapping("/activas")
    public List<Reparacion> listarActivas() {
        return reparacionServicio.listarActivas();
    }

    @Operation(summary = "Buscar una reparación por ID")
    @ApiResponse(responseCode = "200", description = "Reparación encontrada")
    @ApiResponse(responseCode = "404", description = "Reparación no encontrada")
    @GetMapping("/{id}")
    public Reparacion obtenerPorId(@PathVariable Long id) {
        return reparacionServicio.obtenerPorId(id);
    }

    @Operation(summary = "Crear una reparación")
    @ApiResponse(responseCode = "201", description = "Reparación creada correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "409", description = "Se ha alcanzado el máximo de reparaciones activas")
    @PostMapping
    public ResponseEntity<Reparacion> crear(@RequestBody ReparacionPeticionDto dto) {
        Reparacion reparacionCreada = reparacionServicio.crear(dto);
        URI direccion = URI.create("/api/reparaciones/" + reparacionCreada.getId());

        return ResponseEntity.created(direccion).body(reparacionCreada);
    }

    @Operation(summary = "Modificar una reparación")
    @ApiResponse(responseCode = "200", description = "Reparación modificada correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "404", description = "Reparación no encontrada")
    @ApiResponse(responseCode = "409", description = "Se ha alcanzado el máximo de reparaciones activas")
    @PutMapping("/{id}")
    public Reparacion modificar(@PathVariable Long id, @RequestBody ReparacionPeticionDto dto) {
        return reparacionServicio.modificar(id, dto);
    }

    // EJEMPLO EXAMEN - OPERACIÓN ESPECÍFICA QUE CAMBIA ESTADO
    // No es un CRUD nuevo. Es una acción sobre una reparación existente.
    @Operation(summary = "Finalizar una reparación")
    @ApiResponse(responseCode = "200", description = "Reparación finalizada correctamente")
    @ApiResponse(responseCode = "404", description = "Reparación no encontrada")
    @ApiResponse(responseCode = "409", description = "La reparación ya estaba finalizada")
    @PutMapping("/{id}/finalizar")
    public Reparacion finalizar(@PathVariable Long id) {
        return reparacionServicio.finalizar(id);
    }

    @Operation(summary = "Eliminar una reparación")
    @ApiResponse(responseCode = "204", description = "Reparación eliminada correctamente")
    @ApiResponse(responseCode = "404", description = "Reparación no encontrada")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        reparacionServicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
