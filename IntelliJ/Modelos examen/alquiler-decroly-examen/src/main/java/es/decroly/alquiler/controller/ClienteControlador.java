package es.decroly.alquiler.controller;

import es.decroly.alquiler.model.Alquiler;
import es.decroly.alquiler.model.Cliente;
import es.decroly.alquiler.service.AlquilerGestionServicio;
import es.decroly.alquiler.service.AlquilerServicio;
import es.decroly.alquiler.service.ClienteServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Tag(name = "Clientes", description = "Operaciones relacionadas con los clientes")
@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteControlador {

    private final ClienteServicio clienteServicio;
    private final AlquilerServicio alquilerServicio;
    private final AlquilerGestionServicio gestionServicio;

    @Operation(summary = "Listar clientes")
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
            @Parameter(example = "12345678A") @PathVariable String dni) {
        return clienteServicio.obtenerPorDni(dni);
    }

    // EJEMPLO EXAMEN - RECURSOS RELACIONADOS
    @Operation(summary = "Obtener los alquileres de un cliente")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    @GetMapping("/{id}/alquileres")
    public List<Alquiler> listarAlquileres(@PathVariable Long id) {
        return alquilerServicio.listarPorCliente(id);
    }

    @Operation(summary = "Crear un cliente")
    @ApiResponse(responseCode = "201", description = "Cliente creado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "409", description = "DNI repetido")
    @PostMapping
    public ResponseEntity<Cliente> crear(@RequestBody Cliente cliente) {
        Cliente creado = clienteServicio.crear(cliente);
        URI direccion = URI.create("/api/clientes/" + creado.getId());
        return ResponseEntity.created(direccion).body(creado);
    }

    @Operation(summary = "Modificar un cliente")
    @ApiResponse(responseCode = "200", description = "Cliente modificado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    @ApiResponse(responseCode = "409", description = "DNI repetido")
    @PutMapping("/{id}")
    public Cliente modificar(@PathVariable Long id, @RequestBody Cliente cliente) {
        return clienteServicio.modificar(id, cliente);
    }

    @Operation(summary = "Eliminar un cliente si no tiene alquileres")
    @ApiResponse(responseCode = "204", description = "Cliente eliminado correctamente")
    @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    @ApiResponse(responseCode = "409", description = "El cliente tiene alquileres asociados")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        gestionServicio.eliminarClienteSiNoTieneAlquileres(id);
        return ResponseEntity.noContent().build();
    }
}
