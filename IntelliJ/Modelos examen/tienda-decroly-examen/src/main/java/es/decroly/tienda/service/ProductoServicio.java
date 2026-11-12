package es.decroly.tienda.service;

import es.decroly.tienda.dto.ProductoPeticionDto;
import es.decroly.tienda.model.Producto;
import java.util.List;

public interface ProductoServicio {

    // EJEMPLO EXAMEN - VARIOS FILTROS OPCIONALES
    List<Producto> filtrar(String nombre, Double precioMin, Double precioMax,
                           Long categoriaId, int limite);

    List<Producto> listarDisponibles();

    Producto obtenerPorId(Long id);

    // EJEMPLO EXAMEN - BUSCAR POR CAMPO ÚNICO
    Producto obtenerPorCodigo(String codigo);

    Producto crear(ProductoPeticionDto productoPeticionDto);

    Producto modificar(Long id, ProductoPeticionDto productoPeticionDto);

    void eliminar(Long id);

    List<Producto> listarPorCategoria(Long categoriaId);

    // Método auxiliar usado por PedidoServicio para sumar o restar unidades de stock.
    // No es un endpoint: forma parte de la lógica interna de la aplicación.
    void cambiarStock(Long productoId, int diferencia);
}
