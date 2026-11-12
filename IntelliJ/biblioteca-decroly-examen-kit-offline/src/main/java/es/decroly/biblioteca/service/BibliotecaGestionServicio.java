package es.decroly.biblioteca.service;

import es.decroly.biblioteca.dto.CategoriaResumenDto;
import es.decroly.biblioteca.exception.ConflictoException;
import es.decroly.biblioteca.model.Categoria;
import es.decroly.biblioteca.model.Libro;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// EJEMPLO EXAMEN - SERVICIO QUE USA OTROS SERVICIOS
// Sirve cuando una regla necesita datos de más de una entidad.
@Service
@RequiredArgsConstructor
public class BibliotecaGestionServicio {

    private final CategoriaServicio categoriaServicio;
    private final LibroServicio libroServicio;

    // EJEMPLO EXAMEN - RESULTADO CALCULADO
    // Calcula información a partir de una categoría y sus libros y la devuelve en un DTO.
    public CategoriaResumenDto obtenerResumenCategoria(Long categoriaId) {
        Categoria categoria = categoriaServicio.obtenerPorId(categoriaId);
        List<Libro> libros = libroServicio.listarPorCategoria(categoriaId);

        int totalEjemplares = 0;
        int totalDisponibles = 0;

        for (Libro libro : libros) {
            totalEjemplares += libro.getEjemplares();
            totalDisponibles += libro.getDisponibles();
        }

        return new CategoriaResumenDto(
                categoria.getId(),
                categoria.getNombre(),
                libros.size(),
                totalEjemplares,
                totalDisponibles
        );
    }

    // EJEMPLO EXAMEN - REGLA AL BORRAR
    // No permite borrar una categoría que todavía tenga libros asociados.
    // Si la regla no se cumple se lanza 409 Conflict.
    public void eliminarCategoriaSiEstaVacia(Long categoriaId) {
        categoriaServicio.obtenerPorId(categoriaId);

        if (!libroServicio.listarPorCategoria(categoriaId).isEmpty()) {
            throw new ConflictoException(
                    "No se puede eliminar una categoría que tiene libros asociados"
            );
        }

        categoriaServicio.eliminar(categoriaId);
    }
}
