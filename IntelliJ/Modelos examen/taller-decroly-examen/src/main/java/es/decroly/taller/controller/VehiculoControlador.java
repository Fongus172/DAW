package es.decroly.taller.controller;

import es.decroly.taller.dto.VehiculoPeticionDto;
import es.decroly.taller.dto.VehiculoResumenDto;
import es.decroly.taller.model.Reparacion;
import es.decroly.taller.model.Vehiculo;
import es.decroly.taller.service.ReparacionServicio;
import es.decroly.taller.service.TallerGestionServicio;
import es.decroly.taller.service.VehiculoServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Tag(name = "Vehículos", description = "Operaciones relacionadas con los vehículos del taller")
@RestController
@RequestMapping("/api/vehiculos")
@RequiredArgsConstructor
public class VehiculoControlador {

    private final VehiculoServicio vehiculoServicio;
    private final ReparacionServicio reparacionServicio;
    private final TallerGestionServicio tallerGestionServicio;

    // EJEMPLO EXAMEN - VARIOS FILTROS OPCIONALES EN EL MISMO GET
    // GET /api/vehiculos?marca=toyota
    // GET /api/vehiculos?clienteId=1
    // GET /api/vehiculos?marca=toyota&clienteId=1&limite=5
    @Operation(summary = "Listar vehículos y aplicar filtros opcionales")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @ApiResponse(responseCode = "400", description = "Algún filtro no es válido")
    @ApiResponse(responseCode = "404", description = "El cliente usado como filtro no existe")
    @GetMapping
    public List<Vehiculo> listar(
            @Parameter(description = "Texto que debe aparecer en la marca", example = "Toyota")
            @RequestParam(required = false) String marca,

            @Parameter(description = "ID del propietario", example = "1")
            @RequestParam(required = false) Long clienteId,

            @Parameter(description = "Máximo de resultados. 0 significa sin límite", example = "5")
            @RequestParam(defaultValue = "0") int limite) {

        return vehiculoServicio.filtrar(marca, clienteId, limite);
    }

    // EJEMPLO EXAMEN - BUSCAR POR CAMPO ÚNICO
    @Operation(summary = "Buscar un vehículo por matrícula")
    @ApiResponse(responseCode = "200", description = "Vehículo encontrado")
    @ApiResponse(responseCode = "400", description = "Matrícula no válida")
    @ApiResponse(responseCode = "404", description = "Vehículo no encontrado")
    @GetMapping("/matricula/{matricula}")
    public Vehiculo obtenerPorMatricula(
            @Parameter(description = "Matrícula única", example = "1234ABC")
            @PathVariable String matricula) {
        return vehiculoServicio.obtenerPorMatricula(matricula);
    }

    @Operation(summary = "Buscar un vehículo por ID")
    @ApiResponse(responseCode = "200", description = "Vehículo encontrado")
    @ApiResponse(responseCode = "404", description = "Vehículo no encontrado")
    @GetMapping("/{id}")
    public Vehiculo obtenerPorId(@PathVariable Long id) {
        return vehiculoServicio.obtenerPorId(id);
    }

    // EJEMPLO EXAMEN - RECURSOS RELACIONADOS EN UNA CADENA DE TRES ENTIDADES
    // Cliente -> Vehículo -> Reparación. Aquí pedimos todas las reparaciones de un vehículo concreto.
    @Operation(summary = "Obtener las reparaciones de un vehículo")
    @ApiResponse(responseCode = "200", description = "Reparaciones obtenidas correctamente")
    @ApiResponse(responseCode = "404", description = "Vehículo no encontrado")
    @GetMapping("/{id}/reparaciones")
    public List<Reparacion> listarReparacionesPorVehiculo(@PathVariable Long id) {
        return reparacionServicio.listarPorVehiculo(id);
    }

    // EJEMPLO EXAMEN - DTO CON DATOS CALCULADOS
    @Operation(summary = "Obtener un resumen calculado del vehículo")
    @ApiResponse(responseCode = "200", description = "Resumen obtenido correctamente")
    @ApiResponse(responseCode = "404", description = "Vehículo no encontrado")
    @GetMapping("/{id}/resumen")
    public VehiculoResumenDto obtenerResumen(@PathVariable Long id) {
        return tallerGestionServicio.obtenerResumenVehiculo(id);
    }

    // EJEMPLO EXAMEN - POST CON RESPONSEENTITY, 201 Y LOCATION
    @Operation(summary = "Crear un vehículo")
    @ApiResponse(responseCode = "201", description = "Vehículo creado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "409", description = "Ya existe un vehículo con esa matrícula")
    @PostMapping
    public ResponseEntity<Vehiculo> crear(@RequestBody VehiculoPeticionDto dto) {
        Vehiculo vehiculoCreado = vehiculoServicio.crear(dto);
        URI direccion = URI.create("/api/vehiculos/" + vehiculoCreado.getId());

        return ResponseEntity.created(direccion).body(vehiculoCreado);
    }

    @Operation(summary = "Modificar un vehículo")
    @ApiResponse(responseCode = "200", description = "Vehículo modificado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "404", description = "Vehículo no encontrado")
    @ApiResponse(responseCode = "409", description = "Ya existe otro vehículo con esa matrícula")
    @PutMapping("/{id}")
    public Vehiculo modificar(@PathVariable Long id, @RequestBody VehiculoPeticionDto dto) {
        return vehiculoServicio.modificar(id, dto);
    }

    // EJEMPLO EXAMEN - DELETE CON REGLA 409
    @Operation(summary = "Eliminar un vehículo si no tiene reparaciones")
    @ApiResponse(responseCode = "204", description = "Vehículo eliminado correctamente")
    @ApiResponse(responseCode = "404", description = "Vehículo no encontrado")
    @ApiResponse(responseCode = "409", description = "El vehículo tiene reparaciones asociadas")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tallerGestionServicio.eliminarVehiculoSiNoTieneReparaciones(id);
        return ResponseEntity.noContent().build();
    }
}
