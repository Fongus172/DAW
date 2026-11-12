package es.decroly.alquiler.service;

import es.decroly.alquiler.model.Cliente;

import java.util.List;

public interface ClienteServicio {

    List<Cliente> listar();

    Cliente obtenerPorId(Long id);

    Cliente obtenerPorDni(String dni);

    Cliente crear(Cliente cliente);

    Cliente modificar(Long id, Cliente cliente);

    void eliminar(Long id);
}
