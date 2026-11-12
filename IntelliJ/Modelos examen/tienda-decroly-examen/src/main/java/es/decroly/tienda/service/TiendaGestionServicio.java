package es.decroly.tienda.service;

import es.decroly.tienda.dto.CategoriaResumenDto;
import es.decroly.tienda.exception.ConflictoException;
import es.decroly.tienda.model.Categoria;
import es.decroly.tienda.model.Producto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// EJEMPLO EXAMEN - SERVICIO QUE USA OTROS SERVICIOS
// Aquí colocamos operaciones que necesitan consultar varias entidades a la vez.
@Service
@RequiredArgsConstructor
public class TiendaGestionServicio {

    private final CategoriaServicio categoriaServicio;
    private final ProductoServicio productoServicio;
    private final PedidoServicio pedidoServicio;

    // EJEMPLO EXAMEN - RESULTADO CALCULADO CON DTO
    // Calcula cuántos productos hay, el stock total y cuánto vale ese stock.
    public CategoriaResumenDto obtenerResumenCategoria(Long categoriaId) {
        Categoria categoria = categoriaServicio.obtenerPorId(categoriaId);
        List<Producto> productos = productoServicio.listarPorCategoria(categoriaId);

        int stockTotal = 0;
        double valorStock = 0;

        for (Producto producto : productos) {
            stockTotal += producto.getStock();
            valorStock += producto.getPrecio() * producto.getStock();
        }

        return new CategoriaResumenDto(
                categoria.getId(),
                categoria.getNombre(),
                productos.size(),
                stockTotal,
                valorStock
        );
    }

    // EJEMPLO EXAMEN - REGLA AL BORRAR
    // Una categoría con productos no puede borrarse porque dejaría productos apuntando a una categoría inexistente.
    public void eliminarCategoriaSiEstaVacia(Long categoriaId) {
        categoriaServicio.obtenerPorId(categoriaId);

        if (!productoServicio.listarPorCategoria(categoriaId).isEmpty()) {
            throw new ConflictoException(
                    "No se puede eliminar una categoría que tiene productos asociados"
            );
        }

        categoriaServicio.eliminar(categoriaId);
    }

    // EJEMPLO EXAMEN - REGLA AL BORRAR UN RECURSO RELACIONADO
    // No se borra un producto mientras existan pedidos que hagan referencia a él.
    public void eliminarProductoSiNoTienePedidos(Long productoId) {
        productoServicio.obtenerPorId(productoId);

        if (!pedidoServicio.listarPorProducto(productoId).isEmpty()) {
            throw new ConflictoException(
                    "No se puede eliminar un producto que tiene pedidos asociados"
            );
        }

        productoServicio.eliminar(productoId);
    }
}
