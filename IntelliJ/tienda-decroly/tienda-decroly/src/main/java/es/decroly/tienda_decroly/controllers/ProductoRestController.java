package es.decroly.tienda_decroly.controllers;

import es.decroly.tienda_decroly.domain.Producto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@RestController
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

    @GetMapping("/api/productos")
    public List<Producto> listar() {
        return productos;
    }

    @GetMapping("/api/productos/{id}")
    public Producto buscarPorId(@PathVariable Long id) {
        return productos.stream()
                .filter(p -> p.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
}
