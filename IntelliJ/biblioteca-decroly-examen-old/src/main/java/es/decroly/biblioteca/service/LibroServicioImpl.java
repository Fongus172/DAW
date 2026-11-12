package es.decroly.biblioteca.service;

import es.decroly.biblioteca.dto.LibroPeticionDto;
import es.decroly.biblioteca.exception.ConflictoException;
import es.decroly.biblioteca.exception.DatosNoValidosException;
import es.decroly.biblioteca.exception.RecursoNoEncontradoException;
import es.decroly.biblioteca.model.Libro;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LibroServicioImpl implements LibroServicio {

    //en la fase 1 los libros se almacenan en memoria
    private final List<Libro> libros = new ArrayList<>();
    private Long siguienteId = 1L;

    private final CategoriaServicio categoriaServicio;

    @Override
    public List<Libro> listar(String autor) {

        //si no se indica un autor, se devuelven todos los libros
        if (autor == null || autor.isBlank()) {
            return libros;
        }

        List<Libro> resultado = new ArrayList<>();

        for (Libro libro : libros) {
            if (libro.getAutor().toLowerCase().contains(autor.toLowerCase())) {
                resultado.add(libro);
            }
        }

        return resultado;
    }

    @Override
    public List<Libro> listarDisponibles() {

        List<Libro> resultado = new ArrayList<>();

        for (Libro libro : libros) {
            if (libro.getDisponibles() > 0) {
                resultado.add(libro);
            }
        }

        return resultado;
    }

    @Override
    public Libro obtenerPorId(Long id) {

        for (Libro libro : libros) {
            if (libro.getId().equals(id)) {
                return libro;
            }
        }

        throw new RecursoNoEncontradoException("No existe ningún libro con el ID " + id);
    }

    @Override
    public Libro crear(LibroPeticionDto libroPeticionDto) {

        validarLibro(libroPeticionDto);

        for (Libro libro : libros) {
            if (libro.getIsbn().equals(libroPeticionDto.getIsbn())) {
                throw new ConflictoException("Ya existe un libro con el ISBN" + libro.getIsbn());
            }
        }

        Libro libro = new Libro();

        libro.setId(siguienteId);
        siguienteId++;

        libro.setIsbn(libroPeticionDto.getIsbn());
        libro.setTitulo(libroPeticionDto.getTitulo());
        libro.setAutor(libroPeticionDto.getAutor());
        libro.setAnioPublicacion(libroPeticionDto.getAnioPublicacion());
        libro.setEjemplares(libroPeticionDto.getEjemplares());
        //al crear un libro, todos sus ejemplares estarán disponibles
        libro.setDisponibles(libroPeticionDto.getEjemplares());
        libro.setCategoriaId(libroPeticionDto.getCategoriaId());

        libros.add(libro);

        return libro;
    }

    @Override
    public Libro modificar(Long id, LibroPeticionDto libroPeticionDto) {

        Libro libroExistente = obtenerPorId(id);

        validarLibro(libroPeticionDto);

        for (Libro otroLibro : libros) {
            if (!otroLibro.getId().equals(id)
                    && otroLibro.getIsbn().equals(libroPeticionDto.getIsbn())) {
                throw new ConflictoException("Ya existe un libro con el ISBN" + otroLibro.getIsbn());
            }
        }

        libroExistente.setIsbn(libroPeticionDto.getIsbn());
        libroExistente.setTitulo(libroPeticionDto.getTitulo());
        libroExistente.setAutor(libroPeticionDto.getAutor());
        libroExistente.setAnioPublicacion(libroPeticionDto.getAnioPublicacion());
        libroExistente.setEjemplares(libroPeticionDto.getEjemplares());
        libroExistente.setDisponibles(libroPeticionDto.getEjemplares());
        libroExistente.setCategoriaId(libroPeticionDto.getCategoriaId());

        return libroExistente;
    }

    @Override
    public void eliminar(Long id) {

        Libro libro = obtenerPorId(id);
        libros.remove(libro);
    }

    private void validarLibro(LibroPeticionDto libroPeticionDto) {

        if (libroPeticionDto.getIsbn() == null
                || !libroPeticionDto.getIsbn().matches("\\d{13}")) {
            throw new DatosNoValidosException("El ISBN debe tener 13 dígitos");
        }

        if (libroPeticionDto.getTitulo() == null
                || libroPeticionDto.getTitulo().isBlank()) {
            throw new DatosNoValidosException("El título es obligatorio");
        }

        if (libroPeticionDto.getAutor() == null
                || libroPeticionDto.getAutor().isBlank()) {
            throw new DatosNoValidosException("El autor es obligatorio");
        }

        if (libroPeticionDto.getEjemplares() < 1) {
            throw new DatosNoValidosException("Debe haber al menos un ejemplar");
        }

        if (libroPeticionDto.getCategoriaId() == null) {
            throw new DatosNoValidosException("La categoría es obligatoria");
        }

        //aquí se comprueba que la categoría indicada exista antes de crear o modificar el libro
        try {
            categoriaServicio.obtenerPorId(libroPeticionDto.getCategoriaId());
        } catch (RecursoNoEncontradoException e) {
            throw new DatosNoValidosException("La categoría indicada no existe");
        }
    }

    @Override
    public List<Libro> listarPorCategoria(Long categoriaId) {

        categoriaServicio.obtenerPorId(categoriaId);
        List<Libro> resultado = new ArrayList<>();
        for (Libro libro : libros) {
            if (libro.getCategoriaId().equals(categoriaId)) {
                resultado.add(libro);
            }
        }
        return resultado;
    }

    // EJEMPLO EXAMEN - FILTRO TEXTO POR TÍTULO
    // Busca libros cuyo título contiene un texto.
    // No distingue entre mayúsculas y minúsculas.

    // EJEMPLO EXAMEN - FILTRO TEXTO POR TÍTULO
// Busca libros cuyo título contiene un texto.
// No distingue entre mayúsculas y minúsculas.
// Si no encuentra ninguno, devuelve una lista vacía.
// Si el texto está vacío, devuelve un error 400.

    @Override
    public List<Libro> filtrarPorTitulo(String titulo) {
        if (titulo == null || titulo.isBlank()) {
            throw new DatosNoValidosException(
                    "El título de búsqueda no puede estar vacío"
            );
        }

        List<Libro> resultado = new ArrayList<>();

        for (Libro libro : libros) {
            if (libro.getTitulo()
                    .toLowerCase()
                    .contains(titulo.toLowerCase())) {
                resultado.add(libro);
            }
        }

        return resultado;
    }
}