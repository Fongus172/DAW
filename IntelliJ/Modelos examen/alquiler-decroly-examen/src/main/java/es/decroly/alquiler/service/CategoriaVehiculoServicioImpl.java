package es.decroly.alquiler.service;

import es.decroly.alquiler.exception.ConflictoException;
import es.decroly.alquiler.exception.DatosNoValidosException;
import es.decroly.alquiler.exception.RecursoNoEncontradoException;
import es.decroly.alquiler.model.CategoriaVehiculo;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoriaVehiculoServicioImpl implements CategoriaVehiculoServicio {

    // Los datos se guardan en memoria, igual que en Biblioteca Decroly.
    private final List<CategoriaVehiculo> categorias = new ArrayList<>();
    private Long siguienteId = 1L;

    @Override
    public List<CategoriaVehiculo> listar() {
        return categorias;
    }

    @Override
    public CategoriaVehiculo obtenerPorId(Long id) {
        for (CategoriaVehiculo categoria : categorias) {
            if (categoria.getId().equals(id)) {
                return categoria;
            }
        }

        throw new RecursoNoEncontradoException("No existe ninguna categoría de vehículo con ID " + id);
    }

    @Override
    public CategoriaVehiculo crear(CategoriaVehiculo categoria) {
        validarCategoria(categoria);
        comprobarNombreUnico(categoria.getNombre(), null);

        categoria.setId(siguienteId);
        siguienteId++;
        categorias.add(categoria);
        return categoria;
    }

    @Override
    public CategoriaVehiculo modificar(Long id, CategoriaVehiculo categoria) {
        CategoriaVehiculo existente = obtenerPorId(id);
        validarCategoria(categoria);
        comprobarNombreUnico(categoria.getNombre(), id);

        existente.setNombre(categoria.getNombre());
        existente.setDescripcion(categoria.getDescripcion());
        return existente;
    }

    @Override
    public void eliminar(Long id) {
        CategoriaVehiculo categoria = obtenerPorId(id);
        categorias.remove(categoria);
    }

    private void validarCategoria(CategoriaVehiculo categoria) {
        if (categoria.getNombre() == null || categoria.getNombre().isBlank()) {
            throw new DatosNoValidosException("El nombre de la categoría es obligatorio");
        }
    }

    private void comprobarNombreUnico(String nombre, Long idIgnorado) {
        for (CategoriaVehiculo categoria : categorias) {
            boolean esOtraCategoria = idIgnorado == null || !categoria.getId().equals(idIgnorado);

            if (esOtraCategoria && categoria.getNombre().equalsIgnoreCase(nombre)) {
                throw new ConflictoException("Ya existe una categoría con ese nombre");
            }
        }
    }
}
