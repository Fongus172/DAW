package es.decroly.alquiler.controller;

import es.decroly.alquiler.dto.AlquilerPeticionDto;
import es.decroly.alquiler.model.Alquiler;
import es.decroly.alquiler.service.AlquilerServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Tag(name = "Alquileres", description = "Operaciones relacionadas con los alquileres")
@RestController
@RequestMapping("/api/alquileres")
@RequiredArgsConstructor
public class AlquilerControlador {

    private final AlquilerServicio alquilerServicio;

    // EJEMPLO EXAMEN - VARIOS FILTROS OPCIONALES + RANGO NUMÉRICO + defaultValue
    @Operation(summary = "Listar alquileres y aplicar filtros opcionales")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @ApiResponse(responseCode = "400", description = "Algún filtro no es válido")
    @ApiResponse(responseCode = "404", description = "Cliente o vehículo usado como filtro no existe")
    @GetMapping
    public List<Alquiler> listar(
            @Parameter(example = "true") @RequestParam(required = false) Boolean activo,
            @Parameter(example = "1") @RequestParam(required = false) Long clienteId,
            @Parameter(example = "1") @RequestParam(required = false) Long vehiculoId,
            @Parameter(example = "100") @RequestParam(required = false) Double totalMin,
            @Parameter(example = "500") @RequestParam(required = false) Double totalMax,
            @Parameter(description = "0 significa sin límite", example = "5")
            @RequestParam(defaultValue = "0") int limite) {

        return alquilerServicio.filtrar(activo, clienteId, vehiculoId, totalMin, totalMax, limite);
    }

    @Operation(summary = "Listar únicamente los alquileres activos")
    @GetMapping("/activos")
    public List<Alquiler> listarActivos() {
        return alquilerServicio.listarActivos();
    }

    @Operation(summary = "Buscar un alquiler por ID")
    @ApiResponse(responseCode = "200", description = "Alquiler encontrado")
    @ApiResponse(responseCode = "404", description = "Alquiler no encontrado")
    @GetMapping("/{id}")
    public Alquiler obtenerPorId(@PathVariable Long id) {
        return alquilerServicio.obtenerPorId(id);
    }

    // EJEMPLO EXAMEN - CREAR RECURSO + 201 CREATED + LOCATION
    @Operation(summary = "Crear un alquiler y marcar el vehículo como no disponible")
    @ApiResponse(responseCode = "201", description = "Alquiler creado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "409", description = "El vehículo no está disponible")
    @PostMapping
    public ResponseEntity<Alquiler> crear(@RequestBody AlquilerPeticionDto dto) {
        Alquiler creado = alquilerServicio.crear(dto);
        URI direccion = URI.create("/api/alquileres/" + creado.getId());
        return ResponseEntity.created(direccion).body(creado);
    }

    @Operation(summary = "Modificar un alquiler activo")
    @ApiResponse(responseCode = "200", description = "Alquiler modificado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "404", description = "Alquiler no encontrado")
    @ApiResponse(responseCode = "409", description = "Alquiler devuelto o nuevo vehículo no disponible")
    @PutMapping("/{id}")
    public Alquiler modificar(@PathVariable Long id, @RequestBody AlquilerPeticionDto dto) {
        return alquilerServicio.modificar(id, dto);
    }

    // EJEMPLO EXAMEN - OPERACIÓN ESPECÍFICA QUE CAMBIA ESTADO
    @Operation(summary = "Devolver un vehículo y finalizar su alquiler")
    @ApiResponse(responseCode = "200", description = "Vehículo devuelto correctamente")
    @ApiResponse(responseCode = "404", description = "Alquiler no encontrado")
    @ApiResponse(responseCode = "409", description = "El alquiler ya estaba devuelto")
    @PutMapping("/{id}/devolver")
    public Alquiler devolver(@PathVariable Long id) {
        return alquilerServicio.devolver(id);
    }

    @Operation(summary = "Eliminar un alquiler ya devuelto")
    @ApiResponse(responseCode = "204", description = "Alquiler eliminado correctamente")
    @ApiResponse(responseCode = "404", description = "Alquiler no encontrado")
    @ApiResponse(responseCode = "409", description = "El alquiler sigue activo")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        alquilerServicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
