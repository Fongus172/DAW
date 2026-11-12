package es.decroly.biblioteca.service;

import es.decroly.biblioteca.dto.LibroPeticionDto;
import es.decroly.biblioteca.exception.ConflictoException;
import es.decroly.biblioteca.exception.DatosNoValidosException;
import es.decroly.biblioteca.exception.RecursoNoEncontradoException;
import es.decroly.biblioteca.model.Libro;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LibroServicioImpl implements LibroServicio {

    // En la fase 1 los libros se almacenan en memoria.
    private final List<Libro> libros = new ArrayList<>();
    private Long siguienteId = 1L;

    private final CategoriaServicio categoriaServicio;

    @Override
    public List<Libro> listar(String autor) {
        // Si no se indica un autor, se devuelven todos los libros.
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
                throw new ConflictoException("Ya existe un libro con el ISBN " + libro.getIsbn());
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
        // Al crear un libro, todos sus ejemplares estarán disponibles.
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
                throw new ConflictoException("Ya existe un libro con el ISBN " + otroLibro.getIsbn());
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

        // Aquí se comprueba que la categoría indicada exista antes de crear o modificar el libro.
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
    // Si no hay coincidencias devuelve una lista vacía, no un 404.
    // Si el texto está vacío devuelve 400 porque el filtro es inválido.
    @Override
    public List<Libro> filtrarPorTitulo(String titulo) {
        if (titulo == null || titulo.isBlank()) {
            throw new DatosNoValidosException("El título de búsqueda no puede estar vacío");
        }

        List<Libro> resultado = new ArrayList<>();
        for (Libro libro : libros) {
            if (libro.getTitulo().toLowerCase().contains(titulo.toLowerCase())) {
                resultado.add(libro);
            }
        }
        return resultado;
    }

    // EJEMPLO EXAMEN - VARIOS FILTROS OPCIONALES
    // Este método reúne varios patrones en una sola búsqueda:
    // - FILTRO TEXTO: autor y título.
    // - FILTRO NUMÉRICO EXACTO: anio.
    // - FILTRO DESDE UN AÑO: desde.
    // - FILTRO HASTA UN AÑO: hasta.
    // - FILTRO POR RANGO: desde + hasta.
    // - LÍMITE DE RESULTADOS: limite.
    // Los parámetros que llegan como null no se aplican.
    @Override
    public List<Libro> filtrar(String autor, String titulo, Integer anio,
                               Integer desde, Integer hasta, int limite) {

        validarFiltros(titulo, anio, desde, hasta, limite);

        List<Libro> resultado = new ArrayList<>();

        for (Libro libro : libros) {
            boolean coincide = true;

            if (autor != null && !autor.isBlank()
                    && !libro.getAutor().toLowerCase().contains(autor.toLowerCase())) {
                coincide = false;
            }

            if (titulo != null
                    && !libro.getTitulo().toLowerCase().contains(titulo.toLowerCase())) {
                coincide = false;
            }

            if (anio != null
                    && !anio.equals(libro.getAnioPublicacion())) {
                coincide = false;
            }

            if (desde != null
                    && (libro.getAnioPublicacion() == null
                    || libro.getAnioPublicacion() < desde)) {
                coincide = false;
            }

            if (hasta != null
                    && (libro.getAnioPublicacion() == null
                    || libro.getAnioPublicacion() > hasta)) {
                coincide = false;
            }

            if (coincide) {
                resultado.add(libro);

                if (limite > 0 && resultado.size() >= limite) {
                    break;
                }
            }
        }

        return resultado;
    }

    private void validarFiltros(String titulo, Integer anio,
                                Integer desde, Integer hasta, int limite) {
        if (titulo != null && titulo.isBlank()) {
            throw new DatosNoValidosException("El título de búsqueda no puede estar vacío");
        }

        if (anio != null && anio < 0) {
            throw new DatosNoValidosException("El año no puede ser negativo");
        }

        if (desde != null && desde < 0) {
            throw new DatosNoValidosException("El año mínimo no puede ser negativo");
        }

        if (hasta != null && hasta < 0) {
            throw new DatosNoValidosException("El año máximo no puede ser negativo");
        }

        if (desde != null && hasta != null && desde > hasta) {
            throw new DatosNoValidosException("El año mínimo no puede ser mayor que el máximo");
        }

        if (limite < 0) {
            throw new DatosNoValidosException("El límite no puede ser negativo");
        }
    }

    // EJEMPLO EXAMEN - BUSCAR POR CAMPO ÚNICO
    // Es el mismo patrón que buscar por ID, pero usando un campo que también identifica unívocamente.
    @Override
    public Libro obtenerPorIsbn(String isbn) {
        if (isbn == null || !isbn.matches("\\d{13}")) {
            throw new DatosNoValidosException("El ISBN debe tener 13 dígitos");
        }

        for (Libro libro : libros) {
            if (libro.getIsbn().equals(isbn)) {
                return libro;
            }
        }

        throw new RecursoNoEncontradoException("No existe ningún libro con el ISBN " + isbn);
    }
}
