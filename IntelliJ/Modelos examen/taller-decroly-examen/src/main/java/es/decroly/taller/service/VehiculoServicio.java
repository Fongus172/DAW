package es.decroly.taller.service;

import es.decroly.taller.dto.VehiculoPeticionDto;
import es.decroly.taller.model.Vehiculo;
import java.util.List;

public interface VehiculoServicio {

    // EJEMPLO EXAMEN - VARIOS FILTROS OPCIONALES
    List<Vehiculo> filtrar(String marca, Long clienteId, int limite);

    Vehiculo obtenerPorId(Long id);

    // EJEMPLO EXAMEN - BUSCAR POR CAMPO ÚNICO
    Vehiculo obtenerPorMatricula(String matricula);

    Vehiculo crear(VehiculoPeticionDto vehiculoPeticionDto);

    Vehiculo modificar(Long id, VehiculoPeticionDto vehiculoPeticionDto);

    void eliminar(Long id);

    List<Vehiculo> listarPorCliente(Long clienteId);
}
