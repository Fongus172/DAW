package es.decroly.tienda.controller;

import es.decroly.tienda.dto.PedidoPeticionDto;
import es.decroly.tienda.model.Pedido;
import es.decroly.tienda.service.PedidoServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Tag(name = "Pedidos", description = "Operaciones relacionadas con los pedidos")
@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoControlador {

    private final PedidoServicio pedidoServicio;

    @Operation(summary = "Obtener todos los pedidos")
    @ApiResponse(responseCode = "200", description = "Lista de pedidos obtenida correctamente")
    @GetMapping
    public List<Pedido> listar() {
        return pedidoServicio.listar();
    }

    @Operation(summary = "Buscar un pedido por ID")
    @ApiResponse(responseCode = "200", description = "Pedido encontrado")
    @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    @GetMapping("/{id}")
    public Pedido obtenerPorId(@PathVariable Long id) {
        return pedidoServicio.obtenerPorId(id);
    }

    // EJEMPLO EXAMEN - POST QUE CALCULA DATOS Y APLICA UNA REGLA DE STOCK
    @Operation(summary = "Crear un pedido y descontar su stock")
    @ApiResponse(responseCode = "201", description = "Pedido creado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    @ApiResponse(responseCode = "409", description = "No hay stock suficiente")
    @PostMapping
    public ResponseEntity<Pedido> crear(@RequestBody PedidoPeticionDto dto) {
        Pedido pedidoCreado = pedidoServicio.crear(dto);
        URI direccion = URI.create("/api/pedidos/" + pedidoCreado.getId());

        return ResponseEntity.created(direccion).body(pedidoCreado);
    }

    @Operation(summary = "Modificar un pedido y reajustar el stock")
    @ApiResponse(responseCode = "200", description = "Pedido modificado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "404", description = "Pedido o producto no encontrado")
    @ApiResponse(responseCode = "409", description = "No hay stock suficiente")
    @PutMapping("/{id}")
    public Pedido modificar(@PathVariable Long id, @RequestBody PedidoPeticionDto dto) {
        return pedidoServicio.modificar(id, dto);
    }

    // Al eliminar un pedido, PedidoServicio devuelve sus unidades al stock del producto.
    @Operation(summary = "Eliminar un pedido y devolver sus unidades al stock")
    @ApiResponse(responseCode = "204", description = "Pedido eliminado correctamente")
    @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        pedidoServicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }


}
