package es.decroly.biblioteca.service;

import es.decroly.biblioteca.exception.ConflictoException;
import es.decroly.biblioteca.exception.DatosNoValidosException;
import es.decroly.biblioteca.exception.RecursoNoEncontradoException;
import es.decroly.biblioteca.model.Categoria;

import java.util.List;

public interface CategoriaServicio {

    /**
     * Obtiene todas las categorias
     *
     * @return lista de categorías
     */
    List<Categoria> listar();

    /**
     * Obtiene una categoría por su id
     *
     * @param id ID de la categoria
     * @return categoría encontrada
     * @throws RecursoNoEncontradoException si no existe una categoria con ese ID
     */
    Categoria obtenerPorId(Long id);

    /**
     * Crea una nueva categoría
     *
     * @param categoria Categoría a crear
     * @return categoría creada
     * @throws DatosNoValidosException si los datos de la categoría no son válidos
     * @throws ConflictoException      si ya existe una categoría con ese nombre
     */
    Categoria crear(Categoria categoria);

    /**
     * Modifica una categoría ya existente
     *
     * @param id        ID de la categoría
     * @param categoria datos actualizados de la categoría
     * @return categoría modificada
     * @throws RecursoNoEncontradoException si no existe la categoría con ese ID
     * @throws DatosNoValidosException      si los datos de la categoría no son válidos
     * @throws ConflictoException           si ya existe otra categoría con el mismo nombre
     */
    Categoria modificar(Long id, Categoria categoria);

    /**
     * Borra una categoría
     *
     * @param id ID de la categoría a borrar
     * @throws RecursoNoEncontradoException si no existe una categoría con ese nombre
     */
    void eliminar(Long id);
}
