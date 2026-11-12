package es.decroly.academia.service;

import es.decroly.academia.model.Curso;
import java.util.List;

public interface CursoServicio {
    List<Curso> filtrar(String nombre, Double precioMin, Double precioMax, int limite);
    Curso obtenerPorId(Long id);
    Curso obtenerPorCodigo(String codigo);
    Curso crear(Curso curso);
    Curso modificar(Long id, Curso curso);
    void eliminar(Long id);
}
