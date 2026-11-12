package es.decroly.academia.service;

import es.decroly.academia.exception.ConflictoException;
import es.decroly.academia.exception.DatosNoValidosException;
import es.decroly.academia.exception.RecursoNoEncontradoException;
import es.decroly.academia.model.Curso;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CursoServicioImpl implements CursoServicio {

    private final List<Curso> cursos = new ArrayList<>();
    private Long siguienteId = 1L;

    // EJEMPLO EXAMEN - VARIOS FILTROS OPCIONALES + RANGO NUMÉRICO + defaultValue
    // Se puede enviar cualquier combinación de filtros. Los que lleguen como null no se aplican.
    @Override
    public List<Curso> filtrar(String nombre, Double precioMin, Double precioMax, int limite) {
        validarFiltros(precioMin, precioMax, limite);
        List<Curso> resultado = new ArrayList<>();

        for (Curso curso : cursos) {
            boolean coincide = true;

            if (nombre != null && !nombre.isBlank()
                    && !curso.getNombre().toLowerCase().contains(nombre.toLowerCase())) {
                coincide = false;
            }

            if (precioMin != null && curso.getPrecio() < precioMin) {
                coincide = false;
            }

            if (precioMax != null && curso.getPrecio() > precioMax) {
                coincide = false;
            }

            if (coincide) {
                resultado.add(curso);
                if (limite > 0 && resultado.size() >= limite) {
                    break;
                }
            }
        }

        return resultado;
    }

    @Override
    public Curso obtenerPorId(Long id) {
        for (Curso curso : cursos) {
            if (curso.getId().equals(id)) {
                return curso;
            }
        }
        throw new RecursoNoEncontradoException("No existe ningún curso con ID " + id);
    }

    // EJEMPLO EXAMEN - BUSCAR POR CAMPO ÚNICO
    // Un código vacío es un dato inválido (400). Un código correcto que no existe produce 404.
    @Override
    public Curso obtenerPorCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new DatosNoValidosException("El código del curso no puede estar vacío");
        }

        for (Curso curso : cursos) {
            if (curso.getCodigo().equalsIgnoreCase(codigo)) {
                return curso;
            }
        }
        throw new RecursoNoEncontradoException("No existe ningún curso con código " + codigo);
    }

    @Override
    public Curso crear(Curso curso) {
        validarCurso(curso);
        comprobarCodigoUnico(curso.getCodigo(), null);
        curso.setId(siguienteId);
        siguienteId++;
        cursos.add(curso);
        return curso;
    }

    @Override
    public Curso modificar(Long id, Curso curso) {
        Curso existente = obtenerPorId(id);
        validarCurso(curso);
        comprobarCodigoUnico(curso.getCodigo(), id);

        existente.setCodigo(curso.getCodigo());
        existente.setNombre(curso.getNombre());
        existente.setPlazasMaximas(curso.getPlazasMaximas());
        existente.setPrecio(curso.getPrecio());
        return existente;
    }

    @Override
    public void eliminar(Long id) {
        Curso curso = obtenerPorId(id);
        cursos.remove(curso);
    }

    private void validarCurso(Curso curso) {
        if (curso.getCodigo() == null || curso.getCodigo().isBlank()) {
            throw new DatosNoValidosException("El código del curso es obligatorio");
        }
        if (curso.getNombre() == null || curso.getNombre().isBlank()) {
            throw new DatosNoValidosException("El nombre del curso es obligatorio");
        }
        if (curso.getPlazasMaximas() <= 0) {
            throw new DatosNoValidosException("El número de plazas debe ser mayor que 0");
        }
        if (curso.getPrecio() < 0) {
            throw new DatosNoValidosException("El precio no puede ser negativo");
        }
    }

    private void comprobarCodigoUnico(String codigo, Long idIgnorado) {
        for (Curso curso : cursos) {
            boolean esOtroCurso = idIgnorado == null || !curso.getId().equals(idIgnorado);
            if (esOtroCurso && curso.getCodigo().equalsIgnoreCase(codigo)) {
                throw new ConflictoException("Ya existe un curso con ese código");
            }
        }
    }

    private void validarFiltros(Double precioMin, Double precioMax, int limite) {
        if (precioMin != null && precioMin < 0) {
            throw new DatosNoValidosException("El precio mínimo no puede ser negativo");
        }
        if (precioMax != null && precioMax < 0) {
            throw new DatosNoValidosException("El precio máximo no puede ser negativo");
        }
        if (precioMin != null && precioMax != null && precioMin > precioMax) {
            throw new DatosNoValidosException("El precio mínimo no puede ser mayor que el precio máximo");
        }
        if (limite < 0) {
            throw new DatosNoValidosException("El límite no puede ser negativo");
        }
    }
}
