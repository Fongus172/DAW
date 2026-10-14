package es.decroly.tienda_decroly.services;

import es.decroly.tienda_decroly.domain.Producto;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

public abstract class ProductoServiceBase implements ProductoService {

    private final List<Producto> productos;
    private final AtomicLong secuencia;

    public ProductoServiceBase(List<Producto> prodInic) {
        this.productos = new ArrayList<>(prodInic);
        long maxId = 0;
        for (Producto p : prodInic) {
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
}
