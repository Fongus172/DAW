package es.decroly.taller.service;

import es.decroly.taller.config.TallerPropiedades;
import es.decroly.taller.dto.ReparacionPeticionDto;
import es.decroly.taller.exception.ConflictoException;
import es.decroly.taller.exception.DatosNoValidosException;
import es.decroly.taller.exception.RecursoNoEncontradoException;
import es.decroly.taller.model.Reparacion;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReparacionServicioImpl implements ReparacionServicio {

    private final List<Reparacion> reparaciones = new ArrayList<>();
    private Long siguienteId = 1L;

    private final VehiculoServicio vehiculoServicio;
    private final TallerPropiedades propiedades;

    // EJEMPLO EXAMEN - VARIOS FILTROS OPCIONALES
    // Los filtros pueden combinarse. Por ejemplo:
    // estado=PENDIENTE + costeMax=300 + vehiculoId=1.
    // Si no hay coincidencias se devuelve [] con 200 OK.
    @Override
    public List<Reparacion> filtrar(String estado, Double costeMin, Double costeMax,
                                    Long vehiculoId, int limite) {
        validarFiltros(estado, costeMin, costeMax, vehiculoId, limite);

        List<Reparacion> resultado = new ArrayList<>();

        for (Reparacion reparacion : reparaciones) {
            boolean coincide = true;

            if (estado != null && !reparacion.getEstado().equalsIgnoreCase(estado)) {
                coincide = false;
            }

            if (costeMin != null && reparacion.getCoste() < costeMin) {
                coincide = false;
            }

            if (costeMax != null && reparacion.getCoste() > costeMax) {
                coincide = false;
            }

            if (vehiculoId != null && !reparacion.getVehiculoId().equals(vehiculoId)) {
                coincide = false;
            }

            if (coincide) {
                resultado.add(reparacion);

                if (limite > 0 && resultado.size() >= limite) {
                    break;
                }
            }
        }

        return resultado;
    }

    // Consideramos activa cualquier reparación que todavía no esté FINALIZADA.
    @Override
    public List<Reparacion> listarActivas() {
        List<Reparacion> resultado = new ArrayList<>();

        for (Reparacion reparacion : reparaciones) {
            if (!reparacion.getEstado().equalsIgnoreCase("FINALIZADA")) {
                resultado.add(reparacion);
            }
        }

        return resultado;
    }

    @Override
    public Reparacion obtenerPorId(Long id) {
        for (Reparacion reparacion : reparaciones) {
            if (reparacion.getId().equals(id)) {
                return reparacion;
            }
        }

        throw new RecursoNoEncontradoException("No existe ninguna reparación con ID " + id);
    }

    // EJEMPLO EXAMEN - REGLA DE NEGOCIO CON UNA PROPIEDAD DE CONFIGURACIÓN
    // Antes de crear una reparación comprobamos cuántas reparaciones activas tiene el vehículo.
    // Si ya ha alcanzado el máximo configurado en application.properties devolvemos 409 Conflict.
    @Override
    public Reparacion crear(ReparacionPeticionDto dto) {
        validarReparacion(dto);
        vehiculoServicio.obtenerPorId(dto.getVehiculoId());

        int activas = contarReparacionesActivas(dto.getVehiculoId(), null);
        boolean nuevaReparacionEsActiva = !dto.getEstado().equalsIgnoreCase("FINALIZADA");

        if (nuevaReparacionEsActiva && activas >= propiedades.getMaxReparacionesActivas()) {
            throw new ConflictoException(
                    "El vehículo ya tiene el máximo de reparaciones activas permitido: "
                            + propiedades.getMaxReparacionesActivas()
            );
        }

        Reparacion reparacion = new Reparacion();
        reparacion.setId(siguienteId);
        siguienteId++;
        copiarDatos(reparacion, dto);

        reparaciones.add(reparacion);
        return reparacion;
    }

    @Override
    public Reparacion modificar(Long id, ReparacionPeticionDto dto) {
        Reparacion reparacionExistente = obtenerPorId(id);
        validarReparacion(dto);
        vehiculoServicio.obtenerPorId(dto.getVehiculoId());

        boolean pasaAActiva = !dto.getEstado().equalsIgnoreCase("FINALIZADA");
        int activasSinContarEsta = contarReparacionesActivas(dto.getVehiculoId(), id);

        if (pasaAActiva && activasSinContarEsta >= propiedades.getMaxReparacionesActivas()) {
            throw new ConflictoException(
                    "El vehículo ya tiene el máximo de reparaciones activas permitido: "
                            + propiedades.getMaxReparacionesActivas()
            );
        }

        copiarDatos(reparacionExistente, dto);
        return reparacionExistente;
    }

    // EJEMPLO EXAMEN - OPERACIÓN ESPECÍFICA SOBRE UN RECURSO EXISTENTE
    // No creamos otra reparación: buscamos la actual y cambiamos únicamente su estado.
    // Si ya estaba finalizada, la operación entra en conflicto con el estado actual y devolvemos 409.
    @Override
    public Reparacion finalizar(Long id) {
        Reparacion reparacion = obtenerPorId(id);

        if (reparacion.getEstado().equalsIgnoreCase("FINALIZADA")) {
            throw new ConflictoException("La reparación ya está finalizada");
        }

        reparacion.setEstado("FINALIZADA");
        return reparacion;
    }

    @Override
    public void eliminar(Long id) {
        Reparacion reparacion = obtenerPorId(id);
        reparaciones.remove(reparacion);
    }

    @Override
    public List<Reparacion> listarPorVehiculo(Long vehiculoId) {
        vehiculoServicio.obtenerPorId(vehiculoId);

        List<Reparacion> resultado = new ArrayList<>();
        for (Reparacion reparacion : reparaciones) {
            if (reparacion.getVehiculoId().equals(vehiculoId)) {
                resultado.add(reparacion);
            }
        }

        return resultado;
    }

    private void copiarDatos(Reparacion reparacion, ReparacionPeticionDto dto) {
        reparacion.setVehiculoId(dto.getVehiculoId());
        reparacion.setDescripcion(dto.getDescripcion());
        reparacion.setEstado(dto.getEstado().toUpperCase());
        reparacion.setCoste(dto.getCoste());
    }

    private int contarReparacionesActivas(Long vehiculoId, Long idQueNoSeDebeContar) {
        int total = 0;

        for (Reparacion reparacion : reparaciones) {
            boolean esLaMismaReparacion = idQueNoSeDebeContar != null
                    && reparacion.getId().equals(idQueNoSeDebeContar);

            if (!esLaMismaReparacion
                    && reparacion.getVehiculoId().equals(vehiculoId)
                    && !reparacion.getEstado().equalsIgnoreCase("FINALIZADA")) {
                total++;
            }
        }

        return total;
    }

    private void validarReparacion(ReparacionPeticionDto dto) {
        if (dto.getVehiculoId() == null) {
            throw new DatosNoValidosException("El vehículo es obligatorio");
        }

        if (dto.getDescripcion() == null || dto.getDescripcion().isBlank()) {
            throw new DatosNoValidosException("La descripción de la reparación es obligatoria");
        }

        validarEstado(dto.getEstado());

        if (dto.getCoste() < 0) {
            throw new DatosNoValidosException("El coste no puede ser negativo");
        }

        try {
            vehiculoServicio.obtenerPorId(dto.getVehiculoId());
        } catch (RecursoNoEncontradoException e) {
            throw new DatosNoValidosException("El vehículo indicado no existe");
        }
    }

    private void validarEstado(String estado) {
        if (estado == null || estado.isBlank()) {
            throw new DatosNoValidosException("El estado es obligatorio");
        }

        boolean valido = estado.equalsIgnoreCase("PENDIENTE")
                || estado.equalsIgnoreCase("EN_CURSO")
                || estado.equalsIgnoreCase("FINALIZADA");

        if (!valido) {
            throw new DatosNoValidosException(
                    "El estado debe ser PENDIENTE, EN_CURSO o FINALIZADA"
            );
        }
    }

    private void validarFiltros(String estado, Double costeMin, Double costeMax,
                                Long vehiculoId, int limite) {
        if (estado != null) {
            validarEstado(estado);
        }

        if (costeMin != null && costeMin < 0) {
            throw new DatosNoValidosException("El coste mínimo no puede ser negativo");
        }

        if (costeMax != null && costeMax < 0) {
            throw new DatosNoValidosException("El coste máximo no puede ser negativo");
        }

        if (costeMin != null && costeMax != null && costeMin > costeMax) {
            throw new DatosNoValidosException(
                    "El coste mínimo no puede ser mayor que el coste máximo"
            );
        }

        if (limite < 0) {
            throw new DatosNoValidosException("El límite no puede ser negativo");
        }

        if (vehiculoId != null) {
            vehiculoServicio.obtenerPorId(vehiculoId);
        }
    }
}
