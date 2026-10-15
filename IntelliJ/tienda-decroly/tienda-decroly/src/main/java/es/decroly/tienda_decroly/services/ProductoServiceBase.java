package es.decroly.tienda_decroly.services;

import es.decroly.tienda_decroly.domain.Producto;
import es.decroly.tienda_decroly.exceptions.BadRequestException;
import es.decroly.tienda_decroly.exceptions.NotFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;


public abstract class ProductoServiceBase implements ProductoService {

    private final List<Producto> productos;
    private final AtomicLong secuencia;

    public ProductoServiceBase(List<Producto> pordInic) {
        this.productos = new ArrayList(pordInic);
        long maxId = 0;                       // mayor id de los iniciales
        for (Producto p : pordInic) {
            if (p.getId() > maxId) {
                maxId = p.getId();
            }
        }
        this.secuencia = new AtomicLong(maxId);
    }

    @Override
    public List<Producto> listar() {
        return productos;
    }

    @Override
    public Producto buscarPorId(Long id) {
        for (Producto p : productos) {
            if (p.getId().equals(id)) {
                return p;
            }
        }
        throw new NotFoundException(
                "No existe el producto " + id);

    }

    @Override
    public Producto crear(Producto producto) {
        validar(producto);
        producto.setId(secuencia.incrementAndGet());
        productos.add(producto);
        log.info("Producto creado: {}", producto.getId());
        return producto;

    }

    @Override
    public Producto modificar(Long id, Producto datos) {
        validar(datos);
        Producto producto = buscarPorId(id);
        producto.setNombre(datos.getNombre());
        producto.setPrecio(datos.getPrecio());
        producto.setStock(datos.getStock());
        return producto;
    }

    @Override
    public void borrar(Long id) {
        Producto producto = buscarPorId(id);
        productos.remove(producto);

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