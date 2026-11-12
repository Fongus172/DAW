package es.decroly.tienda.service;

import es.decroly.tienda.config.TiendaPropiedades;
import es.decroly.tienda.dto.PedidoPeticionDto;
import es.decroly.tienda.exception.ConflictoException;
import es.decroly.tienda.exception.DatosNoValidosException;
import es.decroly.tienda.exception.RecursoNoEncontradoException;
import es.decroly.tienda.model.Pedido;
import es.decroly.tienda.model.Producto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoServicioImpl implements PedidoServicio {

    // Los pedidos también se guardan en memoria.
    private final List<Pedido> pedidos = new ArrayList<>();
    private Long siguienteId = 1L;

    private final ProductoServicio productoServicio;
    private final TiendaPropiedades propiedades;

    @Override
    public List<Pedido> listar() {
        return pedidos;
    }

    @Override
    public Pedido obtenerPorId(Long id) {
        for (Pedido pedido : pedidos) {
            if (pedido.getId().equals(id)) {
                return pedido;
            }
        }

        throw new RecursoNoEncontradoException("No existe ningún pedido con ID " + id);
    }

    // EJEMPLO EXAMEN - REGLA DE NEGOCIO QUE MODIFICA OTRA ENTIDAD
    // Al crear un pedido:
    // 1. validamos los datos;
    // 2. comprobamos que el producto existe;
    // 3. comprobamos que hay stock suficiente;
    // 4. restamos las unidades pedidas del stock;
    // 5. calculamos el total en el servidor.
    @Override
    public Pedido crear(PedidoPeticionDto dto) {
        validarPedido(dto);
        Producto producto = productoServicio.obtenerPorId(dto.getProductoId());

        if (producto.getStock() < dto.getUnidades()) {
            throw new ConflictoException(
                    "No hay stock suficiente. Stock disponible: " + producto.getStock()
            );
        }

        productoServicio.cambiarStock(producto.getId(), -dto.getUnidades());

        Pedido pedido = new Pedido();
        pedido.setId(siguienteId);
        siguienteId++;
        pedido.setProductoId(producto.getId());
        pedido.setUnidades(dto.getUnidades());
        pedido.setTotal(producto.getPrecio() * dto.getUnidades());

        pedidos.add(pedido);
        return pedido;
    }

    // EJEMPLO EXAMEN - MODIFICAR UNA ENTIDAD MANTENIENDO UNA REGLA DE STOCK
    // Si cambia la cantidad o incluso el producto del pedido, ajustamos el stock de forma coherente.
    @Override
    public Pedido modificar(Long id, PedidoPeticionDto dto) {
        Pedido pedidoExistente = obtenerPorId(id);
        validarPedido(dto);

        Producto productoAnterior = productoServicio.obtenerPorId(pedidoExistente.getProductoId());
        Producto productoNuevo = productoServicio.obtenerPorId(dto.getProductoId());

        if (productoAnterior.getId().equals(productoNuevo.getId())) {
            // Las unidades del pedido actual ya están descontadas del stock.
            // Si el nuevo pedido tiene menos unidades, la diferencia se devuelve al stock.
            // Si tiene más unidades, la diferencia se descuenta. cambiarStock comprueba que no quede negativo.
            int diferencia = pedidoExistente.getUnidades() - dto.getUnidades();
            productoServicio.cambiarStock(productoNuevo.getId(), diferencia);
        } else {
            if (productoNuevo.getStock() < dto.getUnidades()) {
                throw new ConflictoException(
                        "No hay stock suficiente del nuevo producto. Stock disponible: "
                                + productoNuevo.getStock()
                );
            }

            // Devolvemos al producto anterior las unidades que tenía reservadas el pedido.
            productoServicio.cambiarStock(
                    productoAnterior.getId(), pedidoExistente.getUnidades()
            );

            // Descontamos del producto nuevo las unidades solicitadas.
            productoServicio.cambiarStock(productoNuevo.getId(), -dto.getUnidades());
        }

        pedidoExistente.setProductoId(productoNuevo.getId());
        pedidoExistente.setUnidades(dto.getUnidades());
        pedidoExistente.setTotal(productoNuevo.getPrecio() * dto.getUnidades());

        return pedidoExistente;
    }

    // EJEMPLO EXAMEN - DELETE CON EFECTO DE NEGOCIO
    // Al borrar el pedido, las unidades vuelven al stock del producto.
    @Override
    public void eliminar(Long id) {
        Pedido pedido = obtenerPorId(id);
        productoServicio.cambiarStock(pedido.getProductoId(), pedido.getUnidades());
        pedidos.remove(pedido);
    }

    @Override
    public List<Pedido> listarPorProducto(Long productoId) {
        // Si el producto no existe, la URL hace referencia a un recurso inexistente y devolvemos 404.
        productoServicio.obtenerPorId(productoId);

        List<Pedido> resultado = new ArrayList<>();
        for (Pedido pedido : pedidos) {
            if (pedido.getProductoId().equals(productoId)) {
                resultado.add(pedido);
            }
        }

        return resultado;
    }

    private void validarPedido(PedidoPeticionDto dto) {
        if (dto.getProductoId() == null) {
            throw new DatosNoValidosException("El producto es obligatorio");
        }

        if (dto.getUnidades() < 1) {
            throw new DatosNoValidosException("El pedido debe tener al menos una unidad");
        }

        if (dto.getUnidades() > propiedades.getMaxUnidadesPedido()) {
            throw new DatosNoValidosException(
                    "Un pedido no puede superar " + propiedades.getMaxUnidadesPedido() + " unidades"
            );
        }
    }
}
