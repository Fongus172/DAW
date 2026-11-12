package es.decroly.academia.service;

import es.decroly.academia.config.AcademiaPropiedades;
import es.decroly.academia.dto.MatriculaPeticionDto;
import es.decroly.academia.exception.ConflictoException;
import es.decroly.academia.exception.DatosNoValidosException;
import es.decroly.academia.exception.RecursoNoEncontradoException;
import es.decroly.academia.model.Curso;
import es.decroly.academia.model.Matricula;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MatriculaServicioImpl implements MatriculaServicio {

    private final List<Matricula> matriculas = new ArrayList<>();
    private Long siguienteId = 1L;

    private final AlumnoServicio alumnoServicio;
    private final CursoServicio cursoServicio;
    private final AcademiaPropiedades propiedades;

    // EJEMPLO EXAMEN - VARIOS FILTROS OPCIONALES + defaultValue
    @Override
    public List<Matricula> filtrar(Boolean activa, Long alumnoId, Long cursoId, int limite) {
        validarFiltros(alumnoId, cursoId, limite);
        List<Matricula> resultado = new ArrayList<>();

        for (Matricula matricula : matriculas) {
            boolean coincide = true;

            if (activa != null && matricula.isActiva() != activa) {
                coincide = false;
            }
            if (alumnoId != null && !matricula.getAlumnoId().equals(alumnoId)) {
                coincide = false;
            }
            if (cursoId != null && !matricula.getCursoId().equals(cursoId)) {
                coincide = false;
            }

            if (coincide) {
                resultado.add(matricula);
                if (limite > 0 && resultado.size() >= limite) {
                    break;
                }
            }
        }

        return resultado;
    }

    @Override
    public List<Matricula> listarActivas() {
        List<Matricula> resultado = new ArrayList<>();
        for (Matricula matricula : matriculas) {
            if (matricula.isActiva()) {
                resultado.add(matricula);
            }
        }
        return resultado;
    }

    // EJEMPLO EXAMEN - RECURSOS RELACIONADOS
    @Override
    public List<Matricula> listarPorAlumno(Long alumnoId) {
        alumnoServicio.obtenerPorId(alumnoId);
        List<Matricula> resultado = new ArrayList<>();
        for (Matricula matricula : matriculas) {
            if (matricula.getAlumnoId().equals(alumnoId)) {
                resultado.add(matricula);
            }
        }
        return resultado;
    }

    // EJEMPLO EXAMEN - RECURSOS RELACIONADOS
    @Override
    public List<Matricula> listarPorCurso(Long cursoId) {
        cursoServicio.obtenerPorId(cursoId);
        List<Matricula> resultado = new ArrayList<>();
        for (Matricula matricula : matriculas) {
            if (matricula.getCursoId().equals(cursoId)) {
                resultado.add(matricula);
            }
        }
        return resultado;
    }

    @Override
    public Matricula obtenerPorId(Long id) {
        for (Matricula matricula : matriculas) {
            if (matricula.getId().equals(id)) {
                return matricula;
            }
        }
        throw new RecursoNoEncontradoException("No existe ninguna matrícula con ID " + id);
    }

    // EJEMPLO EXAMEN - CREAR UN RECURSO CON REGLAS DE NEGOCIO
    // Antes de crear la matrícula comprobamos: alumno y curso válidos, que no exista otra matrícula activa
    // para la misma pareja, que el curso tenga plazas y que el alumno no supere su máximo permitido.
    @Override
    public Matricula crear(MatriculaPeticionDto dto) {
        validarPeticion(dto);
        comprobarReglasParaMatricula(dto.getAlumnoId(), dto.getCursoId(), null);

        Matricula matricula = new Matricula();
        matricula.setId(siguienteId);
        siguienteId++;
        matricula.setAlumnoId(dto.getAlumnoId());
        matricula.setCursoId(dto.getCursoId());
        matricula.setActiva(true);
        matriculas.add(matricula);
        return matricula;
    }

    // EJEMPLO EXAMEN - MODIFICAR CON REGLAS DE NEGOCIO
    // Solo se pueden modificar matrículas activas. Si se cambia alumno o curso volvemos a comprobar todas las reglas.
    @Override
    public Matricula modificar(Long id, MatriculaPeticionDto dto) {
        Matricula existente = obtenerPorId(id);
        if (!existente.isActiva()) {
            throw new ConflictoException("No se puede modificar una matrícula cancelada");
        }

        validarPeticion(dto);
        comprobarReglasParaMatricula(dto.getAlumnoId(), dto.getCursoId(), id);
        existente.setAlumnoId(dto.getAlumnoId());
        existente.setCursoId(dto.getCursoId());
        return existente;
    }

    // EJEMPLO EXAMEN - OPERACIÓN ESPECÍFICA QUE CAMBIA ESTADO
    // Cancelar no borra la matrícula. Conserva el registro y cambia activa a false.
    // Si ya estaba cancelada, el estado actual entra en conflicto y devolvemos 409.
    @Override
    public Matricula cancelar(Long id) {
        Matricula matricula = obtenerPorId(id);
        if (!matricula.isActiva()) {
            throw new ConflictoException("La matrícula ya estaba cancelada");
        }
        matricula.setActiva(false);
        return matricula;
    }

    @Override
    public void eliminar(Long id) {
        Matricula matricula = obtenerPorId(id);
        if (matricula.isActiva()) {
            throw new ConflictoException("No se puede eliminar una matrícula activa; primero hay que cancelarla");
        }
        matriculas.remove(matricula);
    }

    private void validarPeticion(MatriculaPeticionDto dto) {
        if (dto.getAlumnoId() == null) {
            throw new DatosNoValidosException("El alumno es obligatorio");
        }
        if (dto.getCursoId() == null) {
            throw new DatosNoValidosException("El curso es obligatorio");
        }

        try {
            alumnoServicio.obtenerPorId(dto.getAlumnoId());
        } catch (RecursoNoEncontradoException e) {
            throw new DatosNoValidosException("El alumno indicado no existe");
        }

        try {
            cursoServicio.obtenerPorId(dto.getCursoId());
        } catch (RecursoNoEncontradoException e) {
            throw new DatosNoValidosException("El curso indicado no existe");
        }
    }

    private void comprobarReglasParaMatricula(Long alumnoId, Long cursoId, Long idIgnorado) {
        for (Matricula matricula : matriculas) {
            boolean esOtraMatricula = idIgnorado == null || !matricula.getId().equals(idIgnorado);
            if (esOtraMatricula && matricula.isActiva()
                    && matricula.getAlumnoId().equals(alumnoId)
                    && matricula.getCursoId().equals(cursoId)) {
                throw new ConflictoException("El alumno ya tiene una matrícula activa en ese curso");
            }
        }

        int activasCurso = contarActivasCursoExcluyendo(cursoId, idIgnorado);
        Curso curso = cursoServicio.obtenerPorId(cursoId);
        if (activasCurso >= curso.getPlazasMaximas()) {
            throw new ConflictoException("El curso no tiene plazas disponibles");
        }

        int activasAlumno = contarActivasAlumnoExcluyendo(alumnoId, idIgnorado);
        if (activasAlumno >= propiedades.getMaxMatriculasActivasAlumno()) {
            throw new ConflictoException(
                    "El alumno ya ha alcanzado el máximo de "
                            + propiedades.getMaxMatriculasActivasAlumno() + " matrículas activas"
            );
        }
    }

    private int contarActivasCursoExcluyendo(Long cursoId, Long idIgnorado) {
        int total = 0;
        for (Matricula matricula : matriculas) {
            boolean esOtraMatricula = idIgnorado == null || !matricula.getId().equals(idIgnorado);
            if (esOtraMatricula && matricula.isActiva() && matricula.getCursoId().equals(cursoId)) {
                total++;
            }
        }
        return total;
    }

    private int contarActivasAlumnoExcluyendo(Long alumnoId, Long idIgnorado) {
        int total = 0;
        for (Matricula matricula : matriculas) {
            boolean esOtraMatricula = idIgnorado == null || !matricula.getId().equals(idIgnorado);
            if (esOtraMatricula && matricula.isActiva() && matricula.getAlumnoId().equals(alumnoId)) {
                total++;
            }
        }
        return total;
    }

    private void validarFiltros(Long alumnoId, Long cursoId, int limite) {
        if (limite < 0) {
            throw new DatosNoValidosException("El límite no puede ser negativo");
        }
        if (alumnoId != null) {
            alumnoServicio.obtenerPorId(alumnoId);
        }
        if (cursoId != null) {
            cursoServicio.obtenerPorId(cursoId);
        }
    }
}
