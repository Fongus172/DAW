package es.decroly.academia.service;

import es.decroly.academia.model.Alumno;
import java.util.List;

public interface AlumnoServicio {
    List<Alumno> filtrar(String nombre, int limite);
    Alumno obtenerPorId(Long id);
    Alumno obtenerPorDni(String dni);
    Alumno crear(Alumno alumno);
    Alumno modificar(Long id, Alumno alumno);
    void eliminar(Long id);
}
