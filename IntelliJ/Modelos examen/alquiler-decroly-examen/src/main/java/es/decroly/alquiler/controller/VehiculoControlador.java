package es.decroly.alquiler.controller;

import es.decroly.alquiler.dto.VehiculoPeticionDto;
import es.decroly.alquiler.dto.VehiculoResumenDto;
import es.decroly.alquiler.model.Alquiler;
import es.decroly.alquiler.model.Vehiculo;
import es.decroly.alquiler.service.AlquilerGestionServicio;
import es.decroly.alquiler.service.AlquilerServicio;
import es.decroly.alquiler.service.VehiculoServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Tag(name = "Vehículos", description = "Operaciones relacionadas con los vehículos")
@RestController
@RequestMapping("/api/vehiculos")
@RequiredArgsConstructor
public class VehiculoControlador {

    private final VehiculoServicio vehiculoServicio;
    private final AlquilerServicio alquilerServicio;
    private final AlquilerGestionServicio gestionServicio;

    // EJEMPLO EXAMEN - VARIOS FILTROS OPCIONALES + RANGO + defaultValue
    @Operation(summary = "Listar vehículos y aplicar filtros opcionales")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @ApiResponse(responseCode = "400", description = "Algún filtro no es válido")
    @ApiResponse(responseCode = "404", description = "La categoría usada como filtro no existe")
    @GetMapping
    public List<Vehiculo> listar(
            @Parameter(example = "Seat") @RequestParam(required = false) String marca,
            @Parameter(example = "30") @RequestParam(required = false) Double precioMin,
            @Parameter(example = "80") @RequestParam(required = false) Double precioMax,
            @Parameter(example = "1") @RequestParam(required = false) Long categoriaId,
            @Parameter(example = "true") @RequestParam(required = false) Boolean disponible,
            @Parameter(description = "0 significa sin límite", example = "5")
            @RequestParam(defaultValue = "0") int limite) {

        return vehiculoServicio.filtrar(marca, precioMin, precioMax, categoriaId, disponible, limite);
    }

    @Operation(summary = "Listar únicamente los vehículos disponibles")
    @GetMapping("/disponibles")
    public List<Vehiculo> listarDisponibles() {
        return vehiculoServicio.listarDisponibles();
    }

    // EJEMPLO EXAMEN - BUSCAR POR CAMPO ÚNICO
    @Operation(summary = "Buscar un vehículo por matrícula")
    @ApiResponse(responseCode = "200", description = "Vehículo encontrado")
    @ApiResponse(responseCode = "400", description = "Matrícula no válida")
    @ApiResponse(responseCode = "404", description = "Vehículo no encontrado")
    @GetMapping("/matricula/{matricula}")
    public Vehiculo obtenerPorMatricula(@PathVariable String matricula) {
        return vehiculoServicio.obtenerPorMatricula(matricula);
    }

    @Operation(summary = "Buscar un vehículo por ID")
    @ApiResponse(responseCode = "200", description = "Vehículo encontrado")
    @ApiResponse(responseCode = "404", description = "Vehículo no encontrado")
    @GetMapping("/{id}")
    public Vehiculo obtenerPorId(@PathVariable Long id) {
        return vehiculoServicio.obtenerPorId(id);
    }

    // EJEMPLO EXAMEN - RECURSOS RELACIONADOS
    @Operation(summary = "Obtener los alquileres de un vehículo")
    @GetMapping("/{id}/alquileres")
    public List<Alquiler> listarAlquileres(@PathVariable Long id) {
        return alquilerServicio.listarPorVehiculo(id);
    }

    // EJEMPLO EXAMEN - RESULTADO CALCULADO CON DTO
    @Operation(summary = "Obtener un resumen calculado de los alquileres del vehículo")
    @GetMapping("/{id}/resumen")
    public VehiculoResumenDto obtenerResumen(@PathVariable Long id) {
        return gestionServicio.obtenerResumenVehiculo(id);
    }

    @Operation(summary = "Crear un vehículo")
    @ApiResponse(responseCode = "201", description = "Vehículo creado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "409", description = "Matrícula repetida")
    @PostMapping
    public ResponseEntity<Vehiculo> crear(@RequestBody VehiculoPeticionDto dto) {
        Vehiculo creado = vehiculoServicio.crear(dto);
        URI direccion = URI.create("/api/vehiculos/" + creado.getId());
        return ResponseEntity.created(direccion).body(creado);
    }

    @Operation(summary = "Modificar un vehículo")
    @PutMapping("/{id}")
    public Vehiculo modificar(@PathVariable Long id, @RequestBody VehiculoPeticionDto dto) {
        return vehiculoServicio.modificar(id, dto);
    }

    @Operation(summary = "Eliminar un vehículo si no tiene alquileres")
    @ApiResponse(responseCode = "204", description = "Vehículo eliminado correctamente")
    @ApiResponse(responseCode = "404", description = "Vehículo no encontrado")
    @ApiResponse(responseCode = "409", description = "El vehículo tiene alquileres asociados")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        gestionServicio.eliminarVehiculoSiNoTieneAlquileres(id);
        return ResponseEntity.noContent().build();
    }
}
