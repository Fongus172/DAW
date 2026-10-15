package es.decroly.tienda_decroly.controllers;

import es.decroly.tienda_decroly.domain.Producto;
import es.decroly.tienda_decroly.exceptions.BadRequestException;
import es.decroly.tienda_decroly.exceptions.NotFoundException;
import es.decroly.tienda_decroly.services.ProductoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/productos")
public class ProductoRestController {
    private final ProductoService productoService;
    //PROVISIONAL: los datos van a estar temporalmente en memoria
    private final List<Producto> productos = new ArrayList<>();
    private final AtomicLong secuencia = new AtomicLong();

    public ProductoRestController(ProductoService productoService) {
        this.productoService = productoService;
        anadir("teclado mecánico", 49.9, 15);
        anadir("Ratón inalámbrico", 19.95, 40);
        anadir("Monitor 24 pulgadas", 139.0, 8);
    }

    private void anadir(String nombre, double precio, int stock) {
        Long id = secuencia.incrementAndGet();
        productos.add(new Producto(id, nombre, precio, stock));
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public Producto crear(@RequestBody Producto producto) {
        return productoService.crear(producto);
    }

    private ResponseEntity<Producto> nuevo(Producto producto) {
        Long id = secuencia.incrementAndGet();
        Producto nuevoProducto = new Producto(id, producto.getNombre(), producto.getPrecio(), producto.getStock());
        productos.add(nuevoProducto);
        URI direccion = URI.create("/api/productos/" + id);
        return ResponseEntity.created(direccion).body(nuevoProducto);
    }

    @GetMapping()
    public ResponseEntity<List<Producto>> listar() {
        return productoService.listar();
    }

    @Operation(summary = "Consultar un producto por su id")

    @GetMapping("/{id}")
    public Producto buscarPorId(@PathVariable Long id) {
        return productoService.buscarPorId(id);
    }


    @PutMapping("/{id}")
    public Producto modificar(@PathVariable Long id,
                              @RequestBody Producto datos) {
        return productoService.modificar(id, datos);
    }

    @DeleteMapping("/{id}")
    public void borrar(@PathVariable Long id) {
        productoService.borrar(id);
    }

    private Producto findById(Long id) {
        for (Producto p : productos) {
            if (p.getId().equals(id)) {
                return p;
            }
        }
        throw new NotFoundException("No exixte el producto con id " + id);
    }

    private void validar(Producto p) {
        if (p.getNombre() == null || p.getNombre().isBlank()) {
            throw new BadRequestException("El nombre es obligatorio");
        }
        if (p.getPrecio() < 0) {
            throw new BadRequestException("Precio no puede ser negativo");
        }
        if (p.getStock() < 0) {
            throw new BadRequestException("Stock no puede ser negativo");
        }
    }

}