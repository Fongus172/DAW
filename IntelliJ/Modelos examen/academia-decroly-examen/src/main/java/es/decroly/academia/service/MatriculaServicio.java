package es.decroly.academia.service;

import es.decroly.academia.dto.MatriculaPeticionDto;
import es.decroly.academia.model.Matricula;
import java.util.List;

public interface MatriculaServicio {
    List<Matricula> filtrar(Boolean activa, Long alumnoId, Long cursoId, int limite);
    List<Matricula> listarActivas();
    List<Matricula> listarPorAlumno(Long alumnoId);
    List<Matricula> listarPorCurso(Long cursoId);
    Matricula obtenerPorId(Long id);
    Matricula crear(MatriculaPeticionDto dto);
    Matricula modificar(Long id, MatriculaPeticionDto dto);
    Matricula cancelar(Long id);
    void eliminar(Long id);
}
