package es.decroly.taller.service;

import es.decroly.taller.exception.ConflictoException;
import es.decroly.taller.exception.DatosNoValidosException;
import es.decroly.taller.exception.RecursoNoEncontradoException;
import es.decroly.taller.model.Cliente;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClienteServicioImpl implements ClienteServicio {

    // Igual que en Biblioteca Decroly, los datos se guardan únicamente en memoria.
    // Si se reinicia la aplicación, la lista vuelve a estar vacía y los IDs empiezan otra vez en 1.
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
    // El DNI identifica a un cliente de forma única, igual que un ISBN puede identificar un libro.
    // Si el DNI está vacío devolvemos 400; si es correcto pero no existe devolvemos 404.
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
        Cliente clienteExistente = obtenerPorId(id);
        validarCliente(cliente);
        comprobarDniUnico(cliente.getDni(), id);

        clienteExistente.setDni(cliente.getDni());
        clienteExistente.setNombre(cliente.getNombre());
        clienteExistente.setTelefono(cliente.getTelefono());

        return clienteExistente;
    }

    @Override
    public void eliminar(Long id) {
        Cliente cliente = obtenerPorId(id);
        clientes.remove(cliente);
    }

    private void comprobarDniUnico(String dni, Long idQueSeEstaModificando) {
        for (Cliente cliente : clientes) {
            boolean esOtroCliente = idQueSeEstaModificando == null
                    || !cliente.getId().equals(idQueSeEstaModificando);

            if (esOtroCliente && cliente.getDni().equalsIgnoreCase(dni)) {
                throw new ConflictoException("Ya existe un cliente con el DNI " + dni);
            }
        }
    }

    private void validarCliente(Cliente cliente) {
        if (cliente.getDni() == null || cliente.getDni().isBlank()) {
            throw new DatosNoValidosException("El DNI es obligatorio");
        }

        if (cliente.getNombre() == null || cliente.getNombre().isBlank()) {
            throw new DatosNoValidosException("El nombre del cliente es obligatorio");
        }

        if (cliente.getTelefono() == null || cliente.getTelefono().isBlank()) {
            throw new DatosNoValidosException("El teléfono es obligatorio");
        }
    }
}
