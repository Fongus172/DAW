package es.decroly.tienda_decroly.controllers;

import es.decroly.tienda_decroly.domain.Producto;
import es.decroly.tienda_decroly.exceptions.BadRequestException;
import es.decroly.tienda_decroly.exceptions.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/productos")
public class ProductoRestController {
    //PROVISIONAL: los datos van a estar temporalmente en memoria
    private final List<Producto> productos = new ArrayList<>();
    private final AtomicLong secuencia = new AtomicLong();

    public ProductoRestController() {
        anadir("teclado mecánico", 49.9, 15);
        anadir("Ratón inalámbrico", 19.95, 40);
        anadir("Monitor 24 pulgadas", 139.0, 8);
    }

    private void anadir(String nombre, double precio, int stock) {
        Long id = secuencia.incrementAndGet();
        productos.add(new Producto(id, nombre, precio, stock));
    }

    private Producto nuevo(Producto producto) {
        Long id = secuencia.incrementAndGet();
        Producto np = new Producto(id, producto.getNombre(), producto.getPrecio(), producto.getStock());
        productos.add(np);
        return np;
    }

    @GetMapping()
    public ResponseEntity<List<Producto>> listar() {

        return ResponseEntity.ok(productos);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void borrar(@PathVariable Long id) {
        Producto producto = findById(id);
        productos.remove(producto);
    }

    @GetMapping("/{id}")
    public Producto buscarPorId(@PathVariable Long id) {
        return findById(id);
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

    /*@PostMapping()
    public Producto crear(@RequestBody Producto producto) {
        producto = nuevo(producto);
        return producto;
    }*/

    @PutMapping("/{id}")
    /*public Producto modificar(@PathVariable Long id, @RequestBody Producto datos) {
        Optional<Producto> existente = buscar(id);
        if (existente.isEmpty()) {
            return null;
        }
        Producto producto = existente.get();
        producto.setNombre(datos.getNombre());
        producto.setPrecio(datos.getPrecio());
        producto.setStock(datos.getStock());
        return producto;
    }*/

    private Producto findById(Long id) {
        for (Producto p : productos) {
            if (p.getId().equals(id)) {
                return p;
            }
        }
        throw new NotFoundException("No existe el producto con id " + id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> modificar(@PathVariable Long id,
                                              @RequestBody Producto datos) {
        Producto producto = findById(id);
        producto.setNombre(datos.getNombre());
        producto.setPrecio(datos.getPrecio());
        producto.setStock(datos.getStock());
        validar(producto);
        return ResponseEntity.ok(producto);
    }

    /*@DeleteMapping("/{id}")
    public ResponseEntity<Void> borrar(@PathVariable Long id) {
        Iterator<Producto> it = productos.iterator();
        while (it.hasNext()) {
            Producto p = it.next();
            if (p.getId().equals(id)) {
                it.remove();
                return ResponseEntity.noContent().build();
            }
        }
        return;
    }*/

    @PostMapping()
    public Producto crear(@RequestBody Producto producto) {
        validar(producto);
        Long id = secuencia.incrementAndGet();
        Producto nuevoProducto = new Producto(id, producto.getNombre(), producto.getPrecio(), producto.getStock());
        productos.add(nuevoProducto);
        URI direccion = URI.create("/api/productos/" + id);
        return nuevoProducto;
    }
}
