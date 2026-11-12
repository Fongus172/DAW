package es.decroly.gimnasio.service;

import es.decroly.gimnasio.exception.ConflictoException;
import es.decroly.gimnasio.exception.DatosNoValidosException;
import es.decroly.gimnasio.exception.RecursoNoEncontradoException;
import es.decroly.gimnasio.model.Actividad;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ActividadServiceImpl implements ActividadService {

    //Las actividades se almacenan en memoria
    private final List<Actividad> actividades = new ArrayList<>();
    private Long siguienteId = 1L;

    @Override
    public List<Actividad> listar() {
        return actividades;
    }

    // Buscar por ID
    @Override
    public Actividad obtenerPorId(Long id) {
        for (Actividad actividad : actividades) {
            if (actividad.getId().equals(id)) {
                return actividad;
            }
        }
        throw new RecursoNoEncontradoException("No existe ninguna actividad con ID " + id);
    }

    @Override
    public Actividad crear(Actividad actividad) {
        validarActividad(actividad);

        for (Actividad actividadExistente : actividades) {
            if (actividadExistente.getNombre().equalsIgnoreCase(actividad.getNombre())) {
                throw new ConflictoException("Ya existe una actividad con el nombre " + actividad.getNombre());
            }
        }

        actividad.setId(siguienteId);
        siguienteId++;

        actividades.add(actividad);

        return actividad;
    }

    @Override
    public Actividad modificar(Long id, Actividad actividad) {
        Actividad actividadExistente = obtenerPorId(id);

        validarActividad(actividad);

        for (Actividad otraActividad : actividades) {
            if (!otraActividad.getId().equals(id)
                    && otraActividad.getNombre().equalsIgnoreCase(actividad.getNombre())) {
                throw new ConflictoException("Ya existe una actividad con el nombre " + actividad.getNombre());
            }
        }

        actividadExistente.setNombre(actividad.getNombre());
        actividadExistente.setMonitor(actividad.getMonitor());
        actividadExistente.setPlazas(actividad.getPlazas());

        return actividadExistente;
    }

    @Override
    public void eliminar(Long id) {
        Actividad actividad = obtenerPorId(id);
        actividades.remove(actividad);
    }

    private void validarActividad(Actividad actividad) {
        if (actividad.getNombre() == null || actividad.getNombre().isBlank()) {
            throw new DatosNoValidosException("El nombre de la actividad es obligatorio");
        }

        if (actividad.getNombre().length() > 50) {
            throw new DatosNoValidosException("El nombre de la actividad no puede superar los 50 caracteres");
        }
    }
}
