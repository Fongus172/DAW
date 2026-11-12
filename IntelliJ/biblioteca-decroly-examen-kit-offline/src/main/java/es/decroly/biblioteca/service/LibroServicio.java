package es.decroly.biblioteca.service;

import es.decroly.biblioteca.dto.LibroPeticionDto;
import es.decroly.biblioteca.exception.ConflictoException;
import es.decroly.biblioteca.exception.DatosNoValidosException;
import es.decroly.biblioteca.exception.RecursoNoEncontradoException;
import es.decroly.biblioteca.model.Libro;

import java.util.List;

public interface LibroServicio {

    /**
     * Obtiene los libros y permite filtrarlos por autor.
     *
     * @param autor autor por el que se va a filtrar
     * @return lista de libros
     */
    List<Libro> listar(String autor);

    /**
     * Obtiene los libros que no están agotados.
     *
     * @return lista de libros disponibles
     */
    List<Libro> listarDisponibles();

    /**
     * Obtiene un libro por su ID.
     *
     * @param id ID del libro
     * @return libro encontrado
     * @throws RecursoNoEncontradoException si no existe un libro con ese ID
     */
    Libro obtenerPorId(Long id);

    /**
     * Crea un nuevo libro.
     *
     * @param libroPeticionDto datos del libro a crear
     * @return libro creado
     * @throws DatosNoValidosException si los datos no son válidos
     * @throws ConflictoException si ya existe un libro con el mismo ISBN
     */
    Libro crear(LibroPeticionDto libroPeticionDto);

    /**
     * Modifica un libro ya existente.
     *
     * @param id ID del libro a modificar
     * @param libroPeticionDto datos actualizados
     * @return libro modificado
     * @throws RecursoNoEncontradoException si no existe un libro con ese ID
     * @throws DatosNoValidosException si los datos no son válidos
     * @throws ConflictoException si ya existe otro libro con el mismo ISBN
     */
    Libro modificar(Long id, LibroPeticionDto libroPeticionDto);

    /**
     * Elimina un libro.
     *
     * @param id ID del libro a eliminar
     * @throws RecursoNoEncontradoException si no existe el libro con ese ID
     */
    void eliminar(Long id);

    /**
     * Obtiene los libros de una categoría.
     *
     * @param categoriaId ID de la categoría
     * @return lista de libros de la categoría
     * @throws RecursoNoEncontradoException si no existe una categoría con ese ID
     */
    List<Libro> listarPorCategoria(Long categoriaId);

    // EJEMPLO EXAMEN - FILTRO TEXTO POR TÍTULO
    // Busca libros cuyo título contiene un texto, sin distinguir mayúsculas y minúsculas.
    List<Libro> filtrarPorTitulo(String titulo);

    // EJEMPLO EXAMEN - VARIOS FILTROS OPCIONALES
    // Permite combinar autor, título, año exacto, año mínimo, año máximo y un límite de resultados.
    List<Libro> filtrar(String autor, String titulo, Integer anio,
                        Integer desde, Integer hasta, int limite);

    // EJEMPLO EXAMEN - BUSCAR POR CAMPO ÚNICO
    // Busca un único libro usando su ISBN en vez de su ID.
    Libro obtenerPorIsbn(String isbn);
}
