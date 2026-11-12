package es.decroly.alquiler.service;

import es.decroly.alquiler.config.AlquilerPropiedades;
import es.decroly.alquiler.dto.AlquilerPeticionDto;
import es.decroly.alquiler.exception.ConflictoException;
import es.decroly.alquiler.exception.DatosNoValidosException;
import es.decroly.alquiler.exception.RecursoNoEncontradoException;
import es.decroly.alquiler.model.Alquiler;
import es.decroly.alquiler.model.Vehiculo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlquilerServicioImpl implements AlquilerServicio {

    private final List<Alquiler> alquileres = new ArrayList<>();
    private Long siguienteId = 1L;

    private final ClienteServicio clienteServicio;
    private final VehiculoServicio vehiculoServicio;
    private final AlquilerPropiedades propiedades;

    // EJEMPLO EXAMEN - VARIOS FILTROS OPCIONALES + RANGO NUMÉRICO + defaultValue
    // Todos los filtros se pueden combinar. Un filtro null simplemente no se aplica.
    @Override
    public List<Alquiler> filtrar(Boolean activo, Long clienteId, Long vehiculoId,
                                  Double totalMin, Double totalMax, int limite) {
        validarFiltros(clienteId, vehiculoId, totalMin, totalMax, limite);

        List<Alquiler> resultado = new ArrayList<>();

        for (Alquiler alquiler : alquileres) {
            boolean coincide = true;

            if (activo != null && alquiler.isActivo() != activo) {
                coincide = false;
            }

            if (clienteId != null && !alquiler.getClienteId().equals(clienteId)) {
                coincide = false;
            }

            if (vehiculoId != null && !alquiler.getVehiculoId().equals(vehiculoId)) {
                coincide = false;
            }

            if (totalMin != null && alquiler.getPrecioTotal() < totalMin) {
                coincide = false;
            }

            if (totalMax != null && alquiler.getPrecioTotal() > totalMax) {
                coincide = false;
            }

            if (coincide) {
                resultado.add(alquiler);

                if (limite > 0 && resultado.size() >= limite) {
                    break;
                }
            }
        }

        return resultado;
    }

    @Override
    public List<Alquiler> listarActivos() {
        List<Alquiler> resultado = new ArrayList<>();

        for (Alquiler alquiler : alquileres) {
            if (alquiler.isActivo()) {
                resultado.add(alquiler);
            }
        }

        return resultado;
    }

    // EJEMPLO EXAMEN - RECURSOS RELACIONADOS
    @Override
    public List<Alquiler> listarPorCliente(Long clienteId) {
        clienteServicio.obtenerPorId(clienteId);

        List<Alquiler> resultado = new ArrayList<>();
        for (Alquiler alquiler : alquileres) {
            if (alquiler.getClienteId().equals(clienteId)) {
                resultado.add(alquiler);
            }
        }

        return resultado;
    }

    // EJEMPLO EXAMEN - RECURSOS RELACIONADOS
    @Override
    public List<Alquiler> listarPorVehiculo(Long vehiculoId) {
        vehiculoServicio.obtenerPorId(vehiculoId);

        List<Alquiler> resultado = new ArrayList<>();
        for (Alquiler alquiler : alquileres) {
            if (alquiler.getVehiculoId().equals(vehiculoId)) {
                resultado.add(alquiler);
            }
        }

        return resultado;
    }

    @Override
    public Alquiler obtenerPorId(Long id) {
        for (Alquiler alquiler : alquileres) {
            if (alquiler.getId().equals(id)) {
                return alquiler;
            }
        }

        throw new RecursoNoEncontradoException("No existe ningún alquiler con ID " + id);
    }

    // EJEMPLO EXAMEN - CREAR UN RECURSO Y CAMBIAR EL ESTADO DE OTRO
    // 1. Validamos cliente, vehículo y días.
    // 2. Comprobamos que el vehículo esté disponible.
    // 3. Calculamos el precio total.
    // 4. Creamos el alquiler como activo.
    // 5. Marcamos el vehículo como no disponible.
    @Override
    public Alquiler crear(AlquilerPeticionDto dto) {
        validarAlquiler(dto);

        Vehiculo vehiculo = vehiculoServicio.obtenerPorId(dto.getVehiculoId());

        if (!vehiculo.isDisponible()) {
            throw new ConflictoException("El vehículo ya está alquilado y no está disponible");
        }

        Alquiler alquiler = new Alquiler();
        alquiler.setId(siguienteId);
        siguienteId++;
        copiarDatosYCalcularTotal(alquiler, dto, vehiculo);
        alquiler.setActivo(true);

        alquileres.add(alquiler);
        vehiculoServicio.cambiarDisponibilidad(vehiculo.getId(), false);

        return alquiler;
    }

    // EJEMPLO EXAMEN - MODIFICAR UN RECURSO CON REGLAS DE NEGOCIO
    // Solo permitimos modificar alquileres activos. Si se cambia de vehículo, liberamos el anterior
    // y ocupamos el nuevo. Si el nuevo vehículo ya está alquilado, devolvemos 409 Conflict.
    @Override
    public Alquiler modificar(Long id, AlquilerPeticionDto dto) {
        Alquiler existente = obtenerPorId(id);

        if (!existente.isActivo()) {
            throw new ConflictoException("No se puede modificar un alquiler que ya ha sido devuelto");
        }

        validarAlquiler(dto);
        Vehiculo nuevoVehiculo = vehiculoServicio.obtenerPorId(dto.getVehiculoId());
        boolean cambiaVehiculo = !existente.getVehiculoId().equals(dto.getVehiculoId());

        if (cambiaVehiculo && !nuevoVehiculo.isDisponible()) {
            throw new ConflictoException("El nuevo vehículo seleccionado no está disponible");
        }

        if (cambiaVehiculo) {
            Long vehiculoAnteriorId = existente.getVehiculoId();
            vehiculoServicio.cambiarDisponibilidad(vehiculoAnteriorId, true);
            vehiculoServicio.cambiarDisponibilidad(nuevoVehiculo.getId(), false);
        }

        copiarDatosYCalcularTotal(existente, dto, nuevoVehiculo);
        return existente;
    }

    // EJEMPLO EXAMEN - OPERACIÓN ESPECÍFICA QUE CAMBIA ESTADO
    // Devolver no crea otro recurso. Cambia el alquiler a inactivo y vuelve a dejar libre el vehículo.
    // Repetir la devolución es un conflicto con el estado actual, por eso respondemos 409.
    @Override
    public Alquiler devolver(Long id) {
        Alquiler alquiler = obtenerPorId(id);

        if (!alquiler.isActivo()) {
            throw new ConflictoException("El alquiler ya había sido devuelto");
        }

        alquiler.setActivo(false);
        vehiculoServicio.cambiarDisponibilidad(alquiler.getVehiculoId(), true);
        return alquiler;
    }

    // No permitimos borrar un alquiler activo. Primero debe devolverse el vehículo.
    @Override
    public void eliminar(Long id) {
        Alquiler alquiler = obtenerPorId(id);

        if (alquiler.isActivo()) {
            throw new ConflictoException("No se puede eliminar un alquiler activo; primero hay que devolverlo");
        }

        alquileres.remove(alquiler);
    }

    private void copiarDatosYCalcularTotal(Alquiler alquiler, AlquilerPeticionDto dto, Vehiculo vehiculo) {
        alquiler.setClienteId(dto.getClienteId());
        alquiler.setVehiculoId(dto.getVehiculoId());
        alquiler.setDias(dto.getDias());
        alquiler.setPrecioTotal(vehiculo.getPrecioDia() * dto.getDias());
    }

    private void validarAlquiler(AlquilerPeticionDto dto) {
        if (dto.getClienteId() == null) {
            throw new DatosNoValidosException("El cliente es obligatorio");
        }

        if (dto.getVehiculoId() == null) {
            throw new DatosNoValidosException("El vehículo es obligatorio");
        }

        if (dto.getDias() <= 0) {
            throw new DatosNoValidosException("El número de días debe ser mayor que 0");
        }

        if (dto.getDias() > propiedades.getMaxDias()) {
            throw new DatosNoValidosException(
                    "El alquiler no puede superar " + propiedades.getMaxDias() + " días"
            );
        }

        try {
            clienteServicio.obtenerPorId(dto.getClienteId());
        } catch (RecursoNoEncontradoException e) {
            throw new DatosNoValidosException("El cliente indicado no existe");
        }

        try {
            vehiculoServicio.obtenerPorId(dto.getVehiculoId());
        } catch (RecursoNoEncontradoException e) {
            throw new DatosNoValidosException("El vehículo indicado no existe");
        }
    }

    private void validarFiltros(Long clienteId, Long vehiculoId, Double totalMin,
                                Double totalMax, int limite) {
        if (totalMin != null && totalMin < 0) {
            throw new DatosNoValidosException("El total mínimo no puede ser negativo");
        }

        if (totalMax != null && totalMax < 0) {
            throw new DatosNoValidosException("El total máximo no puede ser negativo");
        }

        if (totalMin != null && totalMax != null && totalMin > totalMax) {
            throw new DatosNoValidosException("El total mínimo no puede ser mayor que el total máximo");
        }

        if (limite < 0) {
            throw new DatosNoValidosException("El límite no puede ser negativo");
        }

        if (clienteId != null) {
            clienteServicio.obtenerPorId(clienteId);
        }

        if (vehiculoId != null) {
            vehiculoServicio.obtenerPorId(vehiculoId);
        }
    }
}
