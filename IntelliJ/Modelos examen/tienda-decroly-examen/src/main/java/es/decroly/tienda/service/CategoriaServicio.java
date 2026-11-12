package es.decroly.tienda.service;

import es.decroly.tienda.model.Categoria;
import java.util.List;

public interface CategoriaServicio {

    List<Categoria> listar();

    Categoria obtenerPorId(Long id);

    Categoria crear(Categoria categoria);

    Categoria modificar(Long id, Categoria categoria);

    void eliminar(Long id);
}
