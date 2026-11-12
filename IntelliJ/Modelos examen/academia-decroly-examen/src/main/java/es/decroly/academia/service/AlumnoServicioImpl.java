package es.decroly.academia.service;

import es.decroly.academia.exception.ConflictoException;
import es.decroly.academia.exception.DatosNoValidosException;
import es.decroly.academia.exception.RecursoNoEncontradoException;
import es.decroly.academia.model.Alumno;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AlumnoServicioImpl implements AlumnoServicio {

    private final List<Alumno> alumnos = new ArrayList<>();
    private Long siguienteId = 1L;

    // EJEMPLO EXAMEN - FILTRO DE TEXTO + defaultValue
    @Override
    public List<Alumno> filtrar(String nombre, int limite) {
        if (limite < 0) {
            throw new DatosNoValidosException("El límite no puede ser negativo");
        }

        List<Alumno> resultado = new ArrayList<>();
        for (Alumno alumno : alumnos) {
            if (nombre == null || nombre.isBlank()
                    || alumno.getNombre().toLowerCase().contains(nombre.toLowerCase())) {
                resultado.add(alumno);
                if (limite > 0 && resultado.size() >= limite) {
                    break;
                }
            }
        }
        return resultado;
    }

    @Override
    public Alumno obtenerPorId(Long id) {
        for (Alumno alumno : alumnos) {
            if (alumno.getId().equals(id)) {
                return alumno;
            }
        }
        throw new RecursoNoEncontradoException("No existe ningún alumno con ID " + id);
    }

    // EJEMPLO EXAMEN - BUSCAR POR CAMPO ÚNICO
    @Override
    public Alumno obtenerPorDni(String dni) {
        if (dni == null || dni.isBlank()) {
            throw new DatosNoValidosException("El DNI no puede estar vacío");
        }
        for (Alumno alumno : alumnos) {
            if (alumno.getDni().equalsIgnoreCase(dni)) {
                return alumno;
            }
        }
        throw new RecursoNoEncontradoException("No existe ningún alumno con DNI " + dni);
    }

    @Override
    public Alumno crear(Alumno alumno) {
        validarAlumno(alumno);
        comprobarDniUnico(alumno.getDni(), null);
        alumno.setId(siguienteId);
        siguienteId++;
        alumnos.add(alumno);
        return alumno;
    }

    @Override
    public Alumno modificar(Long id, Alumno alumno) {
        Alumno existente = obtenerPorId(id);
        validarAlumno(alumno);
        comprobarDniUnico(alumno.getDni(), id);

        existente.setDni(alumno.getDni());
        existente.setNombre(alumno.getNombre());
        existente.setEmail(alumno.getEmail());
        return existente;
    }

    @Override
    public void eliminar(Long id) {
        Alumno alumno = obtenerPorId(id);
        alumnos.remove(alumno);
    }

    private void validarAlumno(Alumno alumno) {
        if (alumno.getDni() == null || alumno.getDni().isBlank()) {
            throw new DatosNoValidosException("El DNI es obligatorio");
        }
        if (alumno.getNombre() == null || alumno.getNombre().isBlank()) {
            throw new DatosNoValidosException("El nombre del alumno es obligatorio");
        }
        if (alumno.getEmail() == null || alumno.getEmail().isBlank()) {
            throw new DatosNoValidosException("El email es obligatorio");
        }
    }

    private void comprobarDniUnico(String dni, Long idIgnorado) {
        for (Alumno alumno : alumnos) {
            boolean esOtroAlumno = idIgnorado == null || !alumno.getId().equals(idIgnorado);
            if (esOtroAlumno && alumno.getDni().equalsIgnoreCase(dni)) {
                throw new ConflictoException("Ya existe un alumno con ese DNI");
            }
        }
    }
}
