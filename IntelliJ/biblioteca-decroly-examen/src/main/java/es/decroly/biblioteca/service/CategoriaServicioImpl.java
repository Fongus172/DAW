package es.decroly.biblioteca.service;

import es.decroly.biblioteca.exception.ConflictoException;
import es.decroly.biblioteca.exception.DatosNoValidosException;
import es.decroly.biblioteca.exception.RecursoNoEncontradoException;
import es.decroly.biblioteca.model.Categoria;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoriaServicioImpl implements CategoriaServicio {

    //en la fase 1 las categorías se almacenan únicamente en memoria
    private final List<Categoria> categorias = new ArrayList<>();
    private Long siguienteId = 1L;

    @Override
    public List<Categoria> listar() {
        return categorias;
    }

    @Override
    public Categoria obtenerPorId(Long id) {
        for (Categoria categoria : categorias) {
            if (categoria.getId().equals(id)) {
                return categoria;
            }
        }

        throw new RecursoNoEncontradoException("No existe una categoría con ID " + id);
    }

    @Override
    public Categoria crear(Categoria categoria) {
        validarCategoria(categoria);

        for (Categoria categoriaExistente : categorias) {
            if (categoriaExistente.getNombre().equalsIgnoreCase(categoria.getNombre())) {
                throw new ConflictoException("Ya existe una categoría con el nombre " + categoria.getNombre());
            }
        }

        categoria.setId(siguienteId);
        siguienteId++;

        categorias.add(categoria);

        return categoria;
    }

    @Override
    public Categoria modificar(Long id, Categoria categoria) {
        Categoria categoriaExistente = obtenerPorId(id);

        validarCategoria(categoria);

        for (Categoria otraCategoria : categorias) {
            if (!otraCategoria.getId().equals(id)
                    && otraCategoria.getNombre().equalsIgnoreCase(categoria.getNombre())) {
                throw new ConflictoException("Ya existe una categoría con el nombre " + categoria.getNombre());
            }
        }

        categoriaExistente.setNombre(categoria.getNombre());
        categoriaExistente.setDescripcion(categoria.getDescripcion());

        return categoriaExistente;
    }

    @Override
    public void eliminar(Long id) {
        Categoria categoria = obtenerPorId(id);
        categorias.remove(categoria);
    }

    private void validarCategoria(Categoria categoria) {
        if (categoria.getNombre() == null || categoria.getNombre().isBlank()) {
            throw new DatosNoValidosException("El nombre de la categoría es obligatorio");
        }

        if (categoria.getNombre().length() > 50) {
            throw new DatosNoValidosException("El nombre de la categoría no puede superar los 50 caractrres");
        }
    }
}