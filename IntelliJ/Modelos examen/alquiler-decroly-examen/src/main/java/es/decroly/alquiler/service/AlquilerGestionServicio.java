package es.decroly.alquiler.service;

import es.decroly.alquiler.dto.VehiculoResumenDto;
import es.decroly.alquiler.exception.ConflictoException;
import es.decroly.alquiler.model.Alquiler;
import es.decroly.alquiler.model.Vehiculo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// EJEMPLO EXAMEN - SERVICIO QUE UTILIZA OTROS SERVICIOS
// Aquí colocamos operaciones que necesitan consultar varias entidades a la vez.
@Service
@RequiredArgsConstructor
public class AlquilerGestionServicio {

    private final CategoriaVehiculoServicio categoriaServicio;
    private final ClienteServicio clienteServicio;
    private final VehiculoServicio vehiculoServicio;
    private final AlquilerServicio alquilerServicio;

    // EJEMPLO EXAMEN - RESULTADO CALCULADO CON DTO
    // El resumen no se guarda en ninguna lista. Se construye en el momento usando los alquileres del vehículo.
    public VehiculoResumenDto obtenerResumenVehiculo(Long vehiculoId) {
        Vehiculo vehiculo = vehiculoServicio.obtenerPorId(vehiculoId);
        List<Alquiler> alquileres = alquilerServicio.listarPorVehiculo(vehiculoId);

        int activos = 0;
        double ingresos = 0;

        for (Alquiler alquiler : alquileres) {
            if (alquiler.isActivo()) {
                activos++;
            }

            ingresos += alquiler.getPrecioTotal();
        }

        return new VehiculoResumenDto(
                vehiculo.getId(),
                vehiculo.getMatricula(),
                alquileres.size(),
                activos,
                ingresos
        );
    }

    // EJEMPLO EXAMEN - REGLA AL BORRAR UNA CATEGORÍA RELACIONADA
    public void eliminarCategoriaSiNoTieneVehiculos(Long categoriaId) {
        categoriaServicio.obtenerPorId(categoriaId);

        if (!vehiculoServicio.listarPorCategoria(categoriaId).isEmpty()) {
            throw new ConflictoException("No se puede eliminar una categoría que tiene vehículos asociados");
        }

        categoriaServicio.eliminar(categoriaId);
    }

    // EJEMPLO EXAMEN - REGLA AL BORRAR UN CLIENTE RELACIONADO
    public void eliminarClienteSiNoTieneAlquileres(Long clienteId) {
        clienteServicio.obtenerPorId(clienteId);

        if (!alquilerServicio.listarPorCliente(clienteId).isEmpty()) {
            throw new ConflictoException("No se puede eliminar un cliente que tiene alquileres asociados");
        }

        clienteServicio.eliminar(clienteId);
    }

    // EJEMPLO EXAMEN - REGLA AL BORRAR UN VEHÍCULO RELACIONADO
    public void eliminarVehiculoSiNoTieneAlquileres(Long vehiculoId) {
        vehiculoServicio.obtenerPorId(vehiculoId);

        if (!alquilerServicio.listarPorVehiculo(vehiculoId).isEmpty()) {
            throw new ConflictoException("No se puede eliminar un vehículo que tiene alquileres asociados");
        }

        vehiculoServicio.eliminar(vehiculoId);
    }
}
