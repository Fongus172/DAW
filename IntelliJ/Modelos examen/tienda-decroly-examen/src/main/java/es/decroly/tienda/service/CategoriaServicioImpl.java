package es.decroly.tienda.service;

import es.decroly.tienda.exception.ConflictoException;
import es.decroly.tienda.exception.DatosNoValidosException;
import es.decroly.tienda.exception.RecursoNoEncontradoException;
import es.decroly.tienda.model.Categoria;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoriaServicioImpl implements CategoriaServicio {

    // Igual que en Biblioteca Decroly Fase 1, los datos se guardan solamente en memoria.
    // Al reiniciar la aplicación, esta lista vuelve a estar vacía.
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

        // El nombre de una categoría debe ser único.
        for (Categoria categoriaExistente : categorias) {
            if (categoriaExistente.getNombre().equalsIgnoreCase(categoria.getNombre())) {
                throw new ConflictoException(
                        "Ya existe una categoría con el nombre " + categoria.getNombre()
                );
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
                throw new ConflictoException(
                        "Ya existe una categoría con el nombre " + categoria.getNombre()
                );
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
            throw new DatosNoValidosException(
                    "El nombre de la categoría no puede superar los 50 caracteres"
            );
        }
    }
}
