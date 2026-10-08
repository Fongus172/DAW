package es.decroly.tienda_decroly.controllers;

import es.decroly.tienda_decroly.domain.Producto;
import es.decroly.tienda_decroly.exceptions.BadRequestException;
import es.decroly.tienda_decroly.exceptions.NotFoundException;
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

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public Producto crear(@RequestBody Producto producto) {
        validar(producto);
        Long id = secuencia.incrementAndGet();
        Producto nuevoProducto = new Producto(id, producto.getNombre(), producto.getPrecio(), producto.getStock());
        productos.add(nuevoProducto);

        /*Si mantengo la respuesta del post como ResponseEntity<Producto>
        dejo lo que esta comentado en las lineas siguientes.
        URI direccion = URI.create("/api/productos/" + id);
        return ResponseEntity.created(direccion).body(nuevoProducto); */

        return nuevoProducto;
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

        return ResponseEntity.ok(productos);
    }

    @GetMapping("/{id}")
    public Producto buscarPorId(@PathVariable Long id) {
        /*return productos.stream()
                .filter(p -> p.getId().equals(id))
                .findFirst()
                .orElse(null);

         */
        /*for (Producto p:  productos){
            if( p.getId().equals(id)){
                return ResponseEntity.ok(p);
            }
        }
        return ResponseEntity.notFound().build(); //Error 404*/
        return findById(id);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Producto> modificar(@PathVariable Long id,
                                              @RequestBody Producto datos) {
        Producto producto = findById(id);
        validar(datos);
        producto.setNombre(datos.getNombre());
        producto.setPrecio(datos.getPrecio());
        producto.setStock(datos.getStock());
        //validar(producto);
        return ResponseEntity.ok(producto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void borrar(@PathVariable Long id) {
        Producto producto = findById(id);
        productos.remove(producto);
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