package es.decroly.taller.service;

import es.decroly.taller.dto.VehiculoResumenDto;
import es.decroly.taller.exception.ConflictoException;
import es.decroly.taller.model.Reparacion;
import es.decroly.taller.model.Vehiculo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// EJEMPLO EXAMEN - SERVICIO QUE UTILIZA OTROS SERVICIOS
// Esta clase contiene operaciones que necesitan consultar varias entidades a la vez.
@Service
@RequiredArgsConstructor
public class TallerGestionServicio {

    private final ClienteServicio clienteServicio;
    private final VehiculoServicio vehiculoServicio;
    private final ReparacionServicio reparacionServicio;

    // EJEMPLO EXAMEN - RESULTADO CALCULADO CON DTO
    // El resumen no está guardado. Se calcula recorriendo las reparaciones del vehículo.
    public VehiculoResumenDto obtenerResumenVehiculo(Long vehiculoId) {
        Vehiculo vehiculo = vehiculoServicio.obtenerPorId(vehiculoId);
        List<Reparacion> reparaciones = reparacionServicio.listarPorVehiculo(vehiculoId);

        int reparacionesActivas = 0;
        double costeTotal = 0;

        for (Reparacion reparacion : reparaciones) {
            if (!reparacion.getEstado().equalsIgnoreCase("FINALIZADA")) {
                reparacionesActivas++;
            }

            costeTotal += reparacion.getCoste();
        }

        return new VehiculoResumenDto(
                vehiculo.getId(),
                vehiculo.getMatricula(),
                reparaciones.size(),
                reparacionesActivas,
                costeTotal
        );
    }

    // EJEMPLO EXAMEN - REGLA AL BORRAR
    // No eliminamos un cliente si todavía tiene vehículos asociados.
    // De lo contrario quedarían vehículos apuntando a un cliente que ya no existe.
    public void eliminarClienteSiNoTieneVehiculos(Long clienteId) {
        clienteServicio.obtenerPorId(clienteId);

        if (!vehiculoServicio.listarPorCliente(clienteId).isEmpty()) {
            throw new ConflictoException(
                    "No se puede eliminar un cliente que tiene vehículos asociados"
            );
        }

        clienteServicio.eliminar(clienteId);
    }

    // EJEMPLO EXAMEN - REGLA AL BORRAR UN RECURSO RELACIONADO
    // Un vehículo con reparaciones conserva historial, por lo que no permitimos borrarlo directamente.
    public void eliminarVehiculoSiNoTieneReparaciones(Long vehiculoId) {
        vehiculoServicio.obtenerPorId(vehiculoId);

        if (!reparacionServicio.listarPorVehiculo(vehiculoId).isEmpty()) {
            throw new ConflictoException(
                    "No se puede eliminar un vehículo que tiene reparaciones asociadas"
            );
        }

        vehiculoServicio.eliminar(vehiculoId);
    }
}
