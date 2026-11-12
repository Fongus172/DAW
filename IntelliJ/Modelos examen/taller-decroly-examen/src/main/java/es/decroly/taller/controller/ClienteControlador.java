package es.decroly.taller.controller;

import es.decroly.taller.model.Cliente;
import es.decroly.taller.model.Vehiculo;
import es.decroly.taller.service.ClienteServicio;
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

@Tag(name = "Clientes", description = "Operaciones relacionadas con los clientes del taller")
@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteControlador {

    private final ClienteServicio clienteServicio;
    private final VehiculoServicio vehiculoServicio;
    private final TallerGestionServicio tallerGestionServicio;

    @Operation(summary = "Obtener todos los clientes")
    @ApiResponse(responseCode = "200", description = "Lista de clientes obtenida correctamente")
    @GetMapping
    public List<Cliente> listar() {
        return clienteServicio.listar();
    }

    @Operation(summary = "Buscar un cliente por ID")
    @ApiResponse(responseCode = "200", description = "Cliente encontrado")
    @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    @GetMapping("/{id}")
    public Cliente obtenerPorId(@PathVariable Long id) {
        return clienteServicio.obtenerPorId(id);
    }

    // EJEMPLO EXAMEN - BUSCAR POR CAMPO ÚNICO
    @Operation(summary = "Buscar un cliente por DNI")
    @ApiResponse(responseCode = "200", description = "Cliente encontrado")
    @ApiResponse(responseCode = "400", description = "DNI no válido")
    @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    @GetMapping("/dni/{dni}")
    public Cliente obtenerPorDni(
            @Parameter(description = "DNI único del cliente", example = "12345678A")
            @PathVariable String dni) {
        return clienteServicio.obtenerPorDni(dni);
    }

    // EJEMPLO EXAMEN - RECURSOS RELACIONADOS
    @Operation(summary = "Obtener los vehículos de un cliente")
    @ApiResponse(responseCode = "200", description = "Vehículos obtenidos correctamente")
    @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    @GetMapping("/{id}/vehiculos")
    public List<Vehiculo> listarVehiculosPorCliente(@PathVariable Long id) {
        return vehiculoServicio.listarPorCliente(id);
    }

    // EJEMPLO EXAMEN - POST CON 201 CREATED Y CABECERA LOCATION
    @Operation(summary = "Crear un cliente")
    @ApiResponse(responseCode = "201", description = "Cliente creado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "409", description = "Ya existe un cliente con ese DNI")
    @PostMapping
    public ResponseEntity<Cliente> crear(@RequestBody Cliente cliente) {
        Cliente clienteCreado = clienteServicio.crear(cliente);
        URI direccion = URI.create("/api/clientes/" + clienteCreado.getId());

        return ResponseEntity.created(direccion).body(clienteCreado);
    }

    @Operation(summary = "Modificar un cliente")
    @ApiResponse(responseCode = "200", description = "Cliente modificado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    @ApiResponse(responseCode = "409", description = "Ya existe otro cliente con ese DNI")
    @PutMapping("/{id}")
    public Cliente modificar(@PathVariable Long id, @RequestBody Cliente cliente) {
        return clienteServicio.modificar(id, cliente);
    }

    // EJEMPLO EXAMEN - DELETE CON REGLA 409
    // El servicio de gestión comprueba primero si el cliente tiene vehículos.
    @Operation(summary = "Eliminar un cliente si no tiene vehículos")
    @ApiResponse(responseCode = "204", description = "Cliente eliminado correctamente")
    @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    @ApiResponse(responseCode = "409", description = "El cliente tiene vehículos asociados")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tallerGestionServicio.eliminarClienteSiNoTieneVehiculos(id);
        return ResponseEntity.noContent().build();
    }
}
