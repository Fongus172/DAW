package es.decroly.alquiler.service;

import es.decroly.alquiler.exception.ConflictoException;
import es.decroly.alquiler.exception.DatosNoValidosException;
import es.decroly.alquiler.exception.RecursoNoEncontradoException;
import es.decroly.alquiler.model.Cliente;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClienteServicioImpl implements ClienteServicio {

    private final List<Cliente> clientes = new ArrayList<>();
    private Long siguienteId = 1L;

    @Override
    public List<Cliente> listar() {
        return clientes;
    }

    @Override
    public Cliente obtenerPorId(Long id) {
        for (Cliente cliente : clientes) {
            if (cliente.getId().equals(id)) {
                return cliente;
            }
        }

        throw new RecursoNoEncontradoException("No existe ningún cliente con ID " + id);
    }

    // EJEMPLO EXAMEN - BUSCAR POR CAMPO ÚNICO
    // Un DNI vacío es un dato inválido (400). Un DNI correcto que no existe produce 404.
    @Override
    public Cliente obtenerPorDni(String dni) {
        if (dni == null || dni.isBlank()) {
            throw new DatosNoValidosException("El DNI no puede estar vacío");
        }

        for (Cliente cliente : clientes) {
            if (cliente.getDni().equalsIgnoreCase(dni)) {
                return cliente;
            }
        }

        throw new RecursoNoEncontradoException("No existe ningún cliente con DNI " + dni);
    }

    @Override
    public Cliente crear(Cliente cliente) {
        validarCliente(cliente);
        comprobarDniUnico(cliente.getDni(), null);

        cliente.setId(siguienteId);
        siguienteId++;
        clientes.add(cliente);
        return cliente;
    }

    @Override
    public Cliente modificar(Long id, Cliente cliente) {
        Cliente existente = obtenerPorId(id);
        validarCliente(cliente);
        comprobarDniUnico(cliente.getDni(), id);

        existente.setDni(cliente.getDni());
        existente.setNombre(cliente.getNombre());
        existente.setEmail(cliente.getEmail());
        return existente;
    }

    @Override
    public void eliminar(Long id) {
        Cliente cliente = obtenerPorId(id);
        clientes.remove(cliente);
    }

    private void validarCliente(Cliente cliente) {
        if (cliente.getDni() == null || cliente.getDni().isBlank()) {
            throw new DatosNoValidosException("El DNI es obligatorio");
        }

        if (cliente.getNombre() == null || cliente.getNombre().isBlank()) {
            throw new DatosNoValidosException("El nombre del cliente es obligatorio");
        }

        if (cliente.getEmail() == null || cliente.getEmail().isBlank()) {
            throw new DatosNoValidosException("El email es obligatorio");
        }
    }

    private void comprobarDniUnico(String dni, Long idIgnorado) {
        for (Cliente cliente : clientes) {
            boolean esOtroCliente = idIgnorado == null || !cliente.getId().equals(idIgnorado);

            if (esOtroCliente && cliente.getDni().equalsIgnoreCase(dni)) {
                throw new ConflictoException("Ya existe un cliente con ese DNI");
            }
        }
    }
}
