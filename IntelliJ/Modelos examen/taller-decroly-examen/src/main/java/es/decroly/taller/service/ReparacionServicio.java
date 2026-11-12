package es.decroly.taller.service;

import es.decroly.taller.dto.ReparacionPeticionDto;
import es.decroly.taller.model.Reparacion;
import java.util.List;

public interface ReparacionServicio {

    // EJEMPLO EXAMEN - FILTROS DE TEXTO, RANGO NUMÉRICO, RELACIÓN Y LÍMITE
    List<Reparacion> filtrar(String estado, Double costeMin, Double costeMax,
                             Long vehiculoId, int limite);

    List<Reparacion> listarActivas();

    Reparacion obtenerPorId(Long id);

    Reparacion crear(ReparacionPeticionDto reparacionPeticionDto);

    Reparacion modificar(Long id, ReparacionPeticionDto reparacionPeticionDto);

    // EJEMPLO EXAMEN - OPERACIÓN ESPECÍFICA QUE CAMBIA EL ESTADO DEL RECURSO
    Reparacion finalizar(Long id);

    void eliminar(Long id);

    List<Reparacion> listarPorVehiculo(Long vehiculoId);
}
