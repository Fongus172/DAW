package es.decroly.biblioteca.service;

import es.decroly.biblioteca.dto.LibroPeticionDto;
import es.decroly.biblioteca.exception.ConflictoException;
import es.decroly.biblioteca.exception.DatosNoValidosException;
import es.decroly.biblioteca.exception.RecursoNoEncontradoException;
import es.decroly.biblioteca.model.Libro;

import java.util.List;

public interface LibroServicio {
    /**
     * Obtiene los libros y permite filtrarlos por autor
     *
     * @param autor Autor por el que se va a filtrar
     * @return lista de libros
     */
    List<Libro> listar(String autor);

    /**
     * Obtiene los libros que no están agotados
     *
     * @return lista de libros disponibles
     */
    List<Libro> listarDisponibles();

    /**
     * Obtiene un libro por su ID
     *
     * @param id ID del libro
     * @return libro a buscar
     * @throws RecursoNoEncontradoException si no existe un libro con el ID especificafdo
     */
    Libro obtenerPorId(Long id);

    /**
     * Crea un nuevo libro
     *
     * @param libroPeticionDto datos del libro a crear
     * @return libro creado
     * @throws DatosNoValidosException si los datos no son válidos
     * @throws ConflictoException      si ya existe un libro con el mismo ISBN
     */
    Libro crear(LibroPeticionDto libroPeticionDto);

    /**
     * Modifica un libro ya existente
     *
     * @param id               ID del libro a modificar
     * @param libroPeticionDto datos actualizados
     * @return libro modificado
     * @throws RecursoNoEncontradoException si no existe un libro con el ID especificadop
     * @throws DatosNoValidosException      si los datos no son válidos
     * @throws ConflictoException           si ya existe un libro con el mismo ISBN
     */
    Libro modificar(Long id, LibroPeticionDto libroPeticionDto);

    /**
     * Elimina un libro
     *
     * @param id ID del libro a eliminar
     * @throws RecursoNoEncontradoException si no existe el libro con el ID especificado
     */
    void eliminar(Long id);

    /**
     * Obtiene los libros de una categoria
     *
     * @param categoriaId ID de la categoría
     * @return lista de libros de la categoría
     * @throws RecursoNoEncontradoException si no existe una categoría con ese ID
     */
    List<Libro> listarPorCategoria(Long categoriaId);

    // EJEMPLO EXAMEN - FILTRO TEXTO POR TÍTULO
    // Busca libros cuyo título contiene un texto.
    // No distingue entre mayúsculas y minúsculas.

    /**
     * Busca libros cuyo título contiene el texto indicado.
     *
     * @param titulo texto que debe aparecer en el título
     * @return lista de libros cuyo título contiene el texto
     */
    List<Libro> filtrarPorTitulo(String titulo);
}
