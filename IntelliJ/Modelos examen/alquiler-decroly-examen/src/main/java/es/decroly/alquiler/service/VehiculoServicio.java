package es.decroly.alquiler.service;

import es.decroly.alquiler.dto.VehiculoPeticionDto;
import es.decroly.alquiler.model.Vehiculo;

import java.util.List;

public interface VehiculoServicio {

    List<Vehiculo> filtrar(String marca, Double precioMin, Double precioMax,
                           Long categoriaId, Boolean disponible, int limite);

    List<Vehiculo> listarDisponibles();

    List<Vehiculo> listarPorCategoria(Long categoriaId);

    Vehiculo obtenerPorId(Long id);

    Vehiculo obtenerPorMatricula(String matricula);

    Vehiculo crear(VehiculoPeticionDto dto);

    Vehiculo modificar(Long id, VehiculoPeticionDto dto);

    void eliminar(Long id);

    void cambiarDisponibilidad(Long id, boolean disponible);
}
