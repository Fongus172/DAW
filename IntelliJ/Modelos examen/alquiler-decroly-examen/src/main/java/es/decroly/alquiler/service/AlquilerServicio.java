package es.decroly.alquiler.service;

import es.decroly.alquiler.dto.AlquilerPeticionDto;
import es.decroly.alquiler.model.Alquiler;

import java.util.List;

public interface AlquilerServicio {

    List<Alquiler> filtrar(Boolean activo, Long clienteId, Long vehiculoId,
                           Double totalMin, Double totalMax, int limite);

    List<Alquiler> listarActivos();

    List<Alquiler> listarPorCliente(Long clienteId);

    List<Alquiler> listarPorVehiculo(Long vehiculoId);

    Alquiler obtenerPorId(Long id);

    Alquiler crear(AlquilerPeticionDto dto);

    Alquiler modificar(Long id, AlquilerPeticionDto dto);

    Alquiler devolver(Long id);

    void eliminar(Long id);
}
