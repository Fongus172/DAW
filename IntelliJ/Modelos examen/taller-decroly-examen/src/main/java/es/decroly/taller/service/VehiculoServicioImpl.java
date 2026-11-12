package es.decroly.taller.service;

import es.decroly.taller.dto.VehiculoPeticionDto;
import es.decroly.taller.exception.ConflictoException;
import es.decroly.taller.exception.DatosNoValidosException;
import es.decroly.taller.exception.RecursoNoEncontradoException;
import es.decroly.taller.model.Vehiculo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehiculoServicioImpl implements VehiculoServicio {

    // Los vehículos se almacenan en memoria. Cada uno guarda el ID del cliente al que pertenece.
    private final List<Vehiculo> vehiculos = new ArrayList<>();
    private Long siguienteId = 1L;

    private final ClienteServicio clienteServicio;

    // EJEMPLO EXAMEN - VARIOS FILTROS OPCIONALES EN EL MISMO GET
    // Un filtro null no se aplica. Si no hay coincidencias devolvemos [] con 200 OK.
    @Override
    public List<Vehiculo> filtrar(String marca, Long clienteId, int limite) {
        validarFiltros(marca, clienteId, limite);

        List<Vehiculo> resultado = new ArrayList<>();

        for (Vehiculo vehiculo : vehiculos) {
            boolean coincide = true;

            if (marca != null
                    && !vehiculo.getMarca().toLowerCase().contains(marca.toLowerCase())) {
                coincide = false;
            }

            if (clienteId != null && !vehiculo.getClienteId().equals(clienteId)) {
                coincide = false;
            }

            if (coincide) {
                resultado.add(vehiculo);

                if (limite > 0 && resultado.size() >= limite) {
                    break;
                }
            }
        }

        return resultado;
    }

    @Override
    public Vehiculo obtenerPorId(Long id) {
        for (Vehiculo vehiculo : vehiculos) {
            if (vehiculo.getId().equals(id)) {
                return vehiculo;
            }
        }

        throw new RecursoNoEncontradoException("No existe ningún vehículo con ID " + id);
    }

    // EJEMPLO EXAMEN - BUSCAR POR CAMPO ÚNICO
    // Una matrícula vacía es un dato inválido (400). Una matrícula válida que no existe produce 404.
    @Override
    public Vehiculo obtenerPorMatricula(String matricula) {
        if (matricula == null || matricula.isBlank()) {
            throw new DatosNoValidosException("La matrícula no puede estar vacía");
        }

        for (Vehiculo vehiculo : vehiculos) {
            if (vehiculo.getMatricula().equalsIgnoreCase(matricula)) {
                return vehiculo;
            }
        }

        throw new RecursoNoEncontradoException(
                "No existe ningún vehículo con la matrícula " + matricula
        );
    }

    @Override
    public Vehiculo crear(VehiculoPeticionDto dto) {
        validarVehiculo(dto);
        comprobarMatriculaUnica(dto.getMatricula(), null);

        Vehiculo vehiculo = new Vehiculo();
        vehiculo.setId(siguienteId);
        siguienteId++;
        copiarDatos(vehiculo, dto);

        vehiculos.add(vehiculo);
        return vehiculo;
    }

    @Override
    public Vehiculo modificar(Long id, VehiculoPeticionDto dto) {
        Vehiculo vehiculoExistente = obtenerPorId(id);
        validarVehiculo(dto);
        comprobarMatriculaUnica(dto.getMatricula(), id);
        copiarDatos(vehiculoExistente, dto);

        return vehiculoExistente;
    }

    @Override
    public void eliminar(Long id) {
        Vehiculo vehiculo = obtenerPorId(id);
        vehiculos.remove(vehiculo);
    }

    // EJEMPLO EXAMEN - RECURSOS RELACIONADOS
    // Primero comprobamos que el cliente existe. Después devolvemos los vehículos cuyo clienteId coincide.
    @Override
    public List<Vehiculo> listarPorCliente(Long clienteId) {
        clienteServicio.obtenerPorId(clienteId);

        List<Vehiculo> resultado = new ArrayList<>();
        for (Vehiculo vehiculo : vehiculos) {
            if (vehiculo.getClienteId().equals(clienteId)) {
                resultado.add(vehiculo);
            }
        }

        return resultado;
    }

    private void copiarDatos(Vehiculo vehiculo, VehiculoPeticionDto dto) {
        vehiculo.setMatricula(dto.getMatricula());
        vehiculo.setMarca(dto.getMarca());
        vehiculo.setModelo(dto.getModelo());
        vehiculo.setClienteId(dto.getClienteId());
    }

    private void comprobarMatriculaUnica(String matricula, Long idQueSeEstaModificando) {
        for (Vehiculo vehiculo : vehiculos) {
            boolean esOtroVehiculo = idQueSeEstaModificando == null
                    || !vehiculo.getId().equals(idQueSeEstaModificando);

            if (esOtroVehiculo && vehiculo.getMatricula().equalsIgnoreCase(matricula)) {
                throw new ConflictoException(
                        "Ya existe un vehículo con la matrícula " + matricula
                );
            }
        }
    }

    private void validarVehiculo(VehiculoPeticionDto dto) {
        if (dto.getMatricula() == null || dto.getMatricula().isBlank()) {
            throw new DatosNoValidosException("La matrícula es obligatoria");
        }

        if (dto.getMarca() == null || dto.getMarca().isBlank()) {
            throw new DatosNoValidosException("La marca es obligatoria");
        }

        if (dto.getModelo() == null || dto.getModelo().isBlank()) {
            throw new DatosNoValidosException("El modelo es obligatorio");
        }

        if (dto.getClienteId() == null) {
            throw new DatosNoValidosException("El cliente es obligatorio");
        }

        // Para crear/modificar un vehículo, un cliente inexistente significa que los datos enviados no son válidos.
        try {
            clienteServicio.obtenerPorId(dto.getClienteId());
        } catch (RecursoNoEncontradoException e) {
            throw new DatosNoValidosException("El cliente indicado no existe");
        }
    }

    private void validarFiltros(String marca, Long clienteId, int limite) {
        if (marca != null && marca.isBlank()) {
            throw new DatosNoValidosException("La marca de búsqueda no puede estar vacía");
        }

        if (limite < 0) {
            throw new DatosNoValidosException("El límite no puede ser negativo");
        }

        if (clienteId != null) {
            clienteServicio.obtenerPorId(clienteId);
        }
    }
}
