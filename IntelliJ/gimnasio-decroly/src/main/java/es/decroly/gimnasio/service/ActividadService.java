package es.decroly.gimnasio.service;

import es.decroly.gimnasio.exception.DatosNoValidosException;
import es.decroly.gimnasio.exception.ConflictoException;
import es.decroly.gimnasio.exception.RecursoNoEncontradoException;
import es.decroly.gimnasio.model.Actividad;
import java.util.List;

public interface ActividadService {

    /**
     * Obtiene las actividades
     *
     * @return lista de actividades
     */
    List<Actividad> listar();

    // Busca una única actividad usando su ID
    Actividad obtenerPorId(Long id);

    /**
     * Crea una nueva actividad
     *
     * @param actividad Actividad a crear
     * @return actividad creada
     * @throws DatosNoValidosException si los datos de la actividad no son válidos
     * @throws ConflictoException      si ya existe una actividad con ese nombre
     */
    Actividad crear(Actividad actividad);

    /**
     * Modifica una actividad ya existente
     *
     * @param id        ID de la actividad
     * @param actividad datos actualizados de la actividad
     * @return actividad modificada
     * @throws RecursoNoEncontradoException si no existe la actividad con ese ID
     * @throws DatosNoValidosException      si los datos de la actividad no son válidos
     * @throws ConflictoException           si ya existe otra actividad con el mismo nombre
     */
    Actividad modificar(Long id, Actividad actividad);

    /**
     * Elimina una actividad
     *
     * @param id    ID de la actividad a eliminar
     */
    void eliminar(Long id);
}
