package es.decroly.taller.service;

import es.decroly.taller.model.Cliente;
import java.util.List;

public interface ClienteServicio {

    List<Cliente> listar();

    Cliente obtenerPorId(Long id);

    // EJEMPLO EXAMEN - BUSCAR POR CAMPO ÚNICO
    Cliente obtenerPorDni(String dni);

    Cliente crear(Cliente cliente);

    Cliente modificar(Long id, Cliente cliente);

    void eliminar(Long id);
}
