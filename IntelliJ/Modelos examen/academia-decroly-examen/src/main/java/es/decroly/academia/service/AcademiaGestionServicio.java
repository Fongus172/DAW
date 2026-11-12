package es.decroly.academia.service;

import es.decroly.academia.dto.CursoResumenDto;
import es.decroly.academia.exception.ConflictoException;
import es.decroly.academia.model.Alumno;
import es.decroly.academia.model.Curso;
import es.decroly.academia.model.Matricula;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

// EJEMPLO EXAMEN - SERVICIO QUE UTILIZA OTROS SERVICIOS
// Aquí ponemos operaciones que necesitan combinar datos de cursos, alumnos y matrículas.
@Service
@RequiredArgsConstructor
public class AcademiaGestionServicio {

    private final CursoServicio cursoServicio;
    private final AlumnoServicio alumnoServicio;
    private final MatriculaServicio matriculaServicio;

    // EJEMPLO EXAMEN - RESULTADO CALCULADO CON DTO
    public CursoResumenDto obtenerResumenCurso(Long cursoId) {
        Curso curso = cursoServicio.obtenerPorId(cursoId);
        List<Matricula> matriculas = matriculaServicio.listarPorCurso(cursoId);

        int activas = 0;
        for (Matricula matricula : matriculas) {
            if (matricula.isActiva()) {
                activas++;
            }
        }

        int disponibles = curso.getPlazasMaximas() - activas;
        double ingresosEstimados = activas * curso.getPrecio();

        return new CursoResumenDto(
                curso.getId(), curso.getCodigo(), curso.getNombre(), curso.getPlazasMaximas(),
                activas, disponibles, ingresosEstimados
        );
    }

    // EJEMPLO EXAMEN - LISTA CALCULADA A PARTIR DE UNA RELACIÓN
    // Devuelve únicamente alumnos cuya matrícula en el curso sigue activa.
    public List<Alumno> listarAlumnosActivosDeCurso(Long cursoId) {
        cursoServicio.obtenerPorId(cursoId);
        List<Alumno> resultado = new ArrayList<>();

        for (Matricula matricula : matriculaServicio.listarPorCurso(cursoId)) {
            if (matricula.isActiva()) {
                resultado.add(alumnoServicio.obtenerPorId(matricula.getAlumnoId()));
            }
        }
        return resultado;
    }

    // EJEMPLO EXAMEN - RELACIÓN EN SENTIDO CONTRARIO
    // Devuelve los cursos en los que el alumno está matriculado actualmente.
    public List<Curso> listarCursosActivosDeAlumno(Long alumnoId) {
        alumnoServicio.obtenerPorId(alumnoId);
        List<Curso> resultado = new ArrayList<>();

        for (Matricula matricula : matriculaServicio.listarPorAlumno(alumnoId)) {
            if (matricula.isActiva()) {
                resultado.add(cursoServicio.obtenerPorId(matricula.getCursoId()));
            }
        }
        return resultado;
    }

    // EJEMPLO EXAMEN - MODIFICAR UN RECURSO SIN ROMPER UNA REGLA RELACIONADA
    // Si el curso ya tiene matrículas activas, no podemos reducir las plazas por debajo de ese número.
    public Curso modificarCursoRespetandoPlazas(Long cursoId, Curso curso) {
        cursoServicio.obtenerPorId(cursoId);

        int activas = 0;
        for (Matricula matricula : matriculaServicio.listarPorCurso(cursoId)) {
            if (matricula.isActiva()) {
                activas++;
            }
        }

        // Los valores 0 o negativos los validará CursoServicio como 400 Bad Request.
        // Solo usamos 409 cuando el número es válido pero entra en conflicto con las matrículas existentes.
        if (curso.getPlazasMaximas() > 0 && curso.getPlazasMaximas() < activas) {
            throw new ConflictoException(
                    "No se pueden reducir las plazas por debajo de las matrículas activas actuales"
            );
        }

        return cursoServicio.modificar(cursoId, curso);
    }

    // EJEMPLO EXAMEN - FILTRAR POR UNA CONDICIÓN CALCULADA
    public List<Curso> listarCursosConPlazas() {
        List<Curso> resultado = new ArrayList<>();
        for (Curso curso : cursoServicio.filtrar(null, null, null, 0)) {
            CursoResumenDto resumen = obtenerResumenCurso(curso.getId());
            if (resumen.getPlazasDisponibles() > 0) {
                resultado.add(curso);
            }
        }
        return resultado;
    }

    // EJEMPLO EXAMEN - REGLA AL BORRAR UN CURSO RELACIONADO
    public void eliminarCursoSiNoTieneMatriculas(Long cursoId) {
        cursoServicio.obtenerPorId(cursoId);
        if (!matriculaServicio.listarPorCurso(cursoId).isEmpty()) {
            throw new ConflictoException("No se puede eliminar un curso que tiene matrículas asociadas");
        }
        cursoServicio.eliminar(cursoId);
    }

    // EJEMPLO EXAMEN - REGLA AL BORRAR UN ALUMNO RELACIONADO
    public void eliminarAlumnoSiNoTieneMatriculas(Long alumnoId) {
        alumnoServicio.obtenerPorId(alumnoId);
        if (!matriculaServicio.listarPorAlumno(alumnoId).isEmpty()) {
            throw new ConflictoException("No se puede eliminar un alumno que tiene matrículas asociadas");
        }
        alumnoServicio.eliminar(alumnoId);
    }
}
