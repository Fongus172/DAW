package es.decroly.alquiler.service;

import es.decroly.alquiler.model.CategoriaVehiculo;

import java.util.List;

public interface CategoriaVehiculoServicio {

    List<CategoriaVehiculo> listar();

    CategoriaVehiculo obtenerPorId(Long id);

    CategoriaVehiculo crear(CategoriaVehiculo categoria);

    CategoriaVehiculo modificar(Long id, CategoriaVehiculo categoria);

    void eliminar(Long id);
}
