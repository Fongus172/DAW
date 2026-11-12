package es.decroly.tienda.controller;

import es.decroly.tienda.dto.ProductoPeticionDto;
import es.decroly.tienda.model.Pedido;
import es.decroly.tienda.model.Producto;
import es.decroly.tienda.service.PedidoServicio;
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

@Tag(name = "Productos", description = "Operaciones relacionadas con los productos de la tienda")
@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoControlador {

    private final ProductoServicio productoServicio;
    private final PedidoServicio pedidoServicio;
    private final TiendaGestionServicio tiendaGestionServicio;

    // EJEMPLO EXAMEN - VARIOS FILTROS OPCIONALES EN EL MISMO GET
    // Ejemplos:
    // GET /api/productos?nombre=teclado
    // GET /api/productos?precioMin=20&precioMax=100
    // GET /api/productos?categoriaId=1
    // GET /api/productos?nombre=teclado&precioMax=80&limite=5
    @Operation(summary = "Listar productos y aplicar filtros opcionales")
    @ApiResponse(responseCode = "200", description = "Lista de productos obtenida correctamente")
    @ApiResponse(responseCode = "400", description = "Algún filtro no es válido")
    @ApiResponse(responseCode = "404", description = "La categoría usada como filtro no existe")
    @GetMapping
    public List<Producto> listar(
            @Parameter(description = "Texto que debe aparecer en el nombre", example = "teclado")
            @RequestParam(required = false) String nombre,

            @Parameter(description = "Precio mínimo", example = "20")
            @RequestParam(required = false) Double precioMin,

            @Parameter(description = "Precio máximo", example = "100")
            @RequestParam(required = false) Double precioMax,

            @Parameter(description = "ID de categoría", example = "1")
            @RequestParam(required = false) Long categoriaId,

            @Parameter(description = "Máximo de resultados. 0 significa sin límite", example = "5")
            @RequestParam(defaultValue = "0") int limite) {

        return productoServicio.filtrar(nombre, precioMin, precioMax, categoriaId, limite);
    }

    @Operation(summary = "Obtener productos con stock disponible")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @GetMapping("/disponibles")
    public List<Producto> listarDisponibles() {
        return productoServicio.listarDisponibles();
    }

    // EJEMPLO EXAMEN - BÚSQUEDA POR CAMPO ÚNICO
    @Operation(summary = "Buscar un producto por su código")
    @ApiResponse(responseCode = "200", description = "Producto encontrado")
    @ApiResponse(responseCode = "400", description = "Código no válido")
    @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    @GetMapping("/codigo/{codigo}")
    public Producto obtenerPorCodigo(
            @Parameter(description = "Código único del producto", example = "TEC-001")
            @PathVariable String codigo) {
        return productoServicio.obtenerPorCodigo(codigo);
    }

    @Operation(summary = "Buscar un producto por ID")
    @ApiResponse(responseCode = "200", description = "Producto encontrado")
    @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    @GetMapping("/{id}")
    public Producto obtenerPorId(@PathVariable Long id) {
        return productoServicio.obtenerPorId(id);
    }


    // EJEMPLO EXAMEN - RECURSOS RELACIONADOS
    // La URL expresa la relación: queremos los pedidos que pertenecen al producto indicado.
    @Operation(summary = "Obtener los pedidos de un producto")
    @ApiResponse(responseCode = "200", description = "Pedidos obtenidos correctamente")
    @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    @GetMapping("/{id}/pedidos")
    public List<Pedido> listarPedidosPorProducto(@PathVariable Long id) {
        return pedidoServicio.listarPorProducto(id);
    }

    // EJEMPLO EXAMEN - POST CON RESPONSEENTITY, 201 Y LOCATION
    @Operation(summary = "Crear un producto")
    @ApiResponse(responseCode = "201", description = "Producto creado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "409", description = "Ya existe un producto con ese código")
    @PostMapping
    public ResponseEntity<Producto> crear(@RequestBody ProductoPeticionDto dto) {
        Producto productoCreado = productoServicio.crear(dto);
        URI direccion = URI.create("/api/productos/" + productoCreado.getId());

        return ResponseEntity.created(direccion).body(productoCreado);
    }

    @Operation(summary = "Modificar un producto")
    @ApiResponse(responseCode = "200", description = "Producto modificado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    @ApiResponse(responseCode = "409", description = "Ya existe otro producto con ese código")
    @PutMapping("/{id}")
    public Producto modificar(@PathVariable Long id, @RequestBody ProductoPeticionDto dto) {
        return productoServicio.modificar(id, dto);
    }

    // EJEMPLO EXAMEN - DELETE CON REGLA 409
    // Si el producto aparece en algún pedido, no se elimina.
    @Operation(summary = "Eliminar un producto si no tiene pedidos")
    @ApiResponse(responseCode = "204", description = "Producto eliminado correctamente")
    @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    @ApiResponse(responseCode = "409", description = "El producto tiene pedidos asociados")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tiendaGestionServicio.eliminarProductoSiNoTienePedidos(id);
        return ResponseEntity.noContent().build();
    }
}
