package es.decroly.tienda_decroly.controllers;

import es.decroly.tienda_decroly.domain.Producto;
import org.springframework.web.bind.annotation.*;

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
    public List<Producto> listar() {
        return productos;
    }

    @GetMapping("/{id}")
    public Producto buscarPorId(@PathVariable Long id) {
        for (Producto p : productos) {
            if (p.getId().equals(id)) {
                return p;
            }
        }
        return null;
    }

    @PostMapping()
    public Producto crear(@RequestBody Producto producto) {
        producto = nuevo(producto);
        return producto;
    }

    @PutMapping("/{id}")
    public Producto modificar(@PathVariable Long id, @RequestBody Producto datos) {
        Optional<Producto> existente = buscar(id);
        if (existente.isEmpty()) {
            return null;
        }
        Producto producto = existente.get();
        producto.setNombre(datos.getNombre());
        producto.setPrecio(datos.getPrecio());
        producto.setStock(datos.getStock());
        return producto;
    }

    private Optional<Producto> buscar(Long id){
        for (Producto p : productos){
            if (p.getId().equals(id)){
                it.remove();
            }
        }
    }

    @DeleteMapping("/{id}")
    public void borrar(@PathVariable Long id) {
        Iterator<Producto> it = productos.iterator();
        while (it.hasNext()){
            Producto p = it.next();
            if (p.getId().equals(id)){
                it.remove();
            }
        }
    }
}
