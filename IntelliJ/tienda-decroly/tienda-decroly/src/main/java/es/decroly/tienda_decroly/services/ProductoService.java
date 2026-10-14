package es.decroly.tienda_decroly.services;

import es.decroly.tienda_decroly.domain.Producto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductoService {
    List<Producto> listar();

    Producto buscarPorId(Long id);

    Producto crear(Producto producto);

    Producto modificar(Long id, Producto datos);

    void borrar(Long id);
}
