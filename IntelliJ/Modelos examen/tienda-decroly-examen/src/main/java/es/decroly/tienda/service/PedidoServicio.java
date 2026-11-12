package es.decroly.tienda.service;

import es.decroly.tienda.dto.PedidoPeticionDto;
import es.decroly.tienda.model.Pedido;
import java.util.List;

public interface PedidoServicio {

    List<Pedido> listar();

    Pedido obtenerPorId(Long id);

    Pedido crear(PedidoPeticionDto pedidoPeticionDto);

    Pedido modificar(Long id, PedidoPeticionDto pedidoPeticionDto);

    void eliminar(Long id);

    List<Pedido> listarPorProducto(Long productoId);
}
