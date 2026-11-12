package es.decroly.alquiler.service;

import es.decroly.alquiler.dto.VehiculoPeticionDto;
import es.decroly.alquiler.exception.ConflictoException;
import es.decroly.alquiler.exception.DatosNoValidosException;
import es.decroly.alquiler.exception.RecursoNoEncontradoException;
import es.decroly.alquiler.model.Vehiculo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehiculoServicioImpl implements VehiculoServicio {

    private final List<Vehiculo> vehiculos = new ArrayList<>();
    private Long siguienteId = 1L;

    private final CategoriaVehiculoServicio categoriaServicio;

    // EJEMPLO EXAMEN - VARIOS FILTROS OPCIONALES
    // Se pueden combinar marca, rango de precios, categoría, disponibilidad y límite.
    // Si no hay coincidencias devolvemos [] con 200 OK.
    @Override
    public List<Vehiculo> filtrar(String marca, Double precioMin, Double precioMax,
                                  Long categoriaId, Boolean disponible, int limite) {
        validarFiltros(marca, precioMin, precioMax, categoriaId, limite);

        List<Vehiculo> resultado = new ArrayList<>();

        for (Vehiculo vehiculo : vehiculos) {
            boolean coincide = true;

            if (marca != null && !vehiculo.getMarca().toLowerCase().contains(marca.toLowerCase())) {
                coincide = false;
            }

            if (precioMin != null && vehiculo.getPrecioDia() < precioMin) {
                coincide = false;
            }

            if (precioMax != null && vehiculo.getPrecioDia() > precioMax) {
                coincide = false;
            }

            if (categoriaId != null && !vehiculo.getCategoriaId().equals(categoriaId)) {
                coincide = false;
            }

            if (disponible != null && vehiculo.isDisponible() != disponible) {
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
    public List<Vehiculo> listarDisponibles() {
        List<Vehiculo> resultado = new ArrayList<>();

        for (Vehiculo vehiculo : vehiculos) {
            if (vehiculo.isDisponible()) {
                resultado.add(vehiculo);
            }
        }

        return resultado;
    }

    // EJEMPLO EXAMEN - RECURSOS RELACIONADOS
    @Override
    public List<Vehiculo> listarPorCategoria(Long categoriaId) {
        categoriaServicio.obtenerPorId(categoriaId);

        List<Vehiculo> resultado = new ArrayList<>();
        for (Vehiculo vehiculo : vehiculos) {
            if (vehiculo.getCategoriaId().equals(categoriaId)) {
                resultado.add(vehiculo);
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

        throw new RecursoNoEncontradoException("No existe ningún vehículo con matrícula " + matricula);
    }

    @Override
    public Vehiculo crear(VehiculoPeticionDto dto) {
        validarVehiculo(dto);
        comprobarMatriculaUnica(dto.getMatricula(), null);

        Vehiculo vehiculo = new Vehiculo();
        vehiculo.setId(siguienteId);
        siguienteId++;
        copiarDatos(vehiculo, dto);
        vehiculo.setDisponible(true);

        vehiculos.add(vehiculo);
        return vehiculo;
    }

    @Override
    public Vehiculo modificar(Long id, VehiculoPeticionDto dto) {
        Vehiculo existente = obtenerPorId(id);
        validarVehiculo(dto);
        comprobarMatriculaUnica(dto.getMatricula(), id);

        copiarDatos(existente, dto);
        // No tocamos disponible: ese dato lo controla el proceso de alquilar/devolver.
        return existente;
    }

    @Override
    public void eliminar(Long id) {
        Vehiculo vehiculo = obtenerPorId(id);
        vehiculos.remove(vehiculo);
    }

    // Este método es interno: AlquilerServicio lo usa cuando un vehículo se alquila o se devuelve.
    @Override
    public void cambiarDisponibilidad(Long id, boolean disponible) {
        Vehiculo vehiculo = obtenerPorId(id);
        vehiculo.setDisponible(disponible);
    }

    private void copiarDatos(Vehiculo vehiculo, VehiculoPeticionDto dto) {
        vehiculo.setMatricula(dto.getMatricula().toUpperCase());
        vehiculo.setMarca(dto.getMarca());
        vehiculo.setModelo(dto.getModelo());
        vehiculo.setPrecioDia(dto.getPrecioDia());
        vehiculo.setCategoriaId(dto.getCategoriaId());
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

        if (dto.getPrecioDia() <= 0) {
            throw new DatosNoValidosException("El precio por día debe ser mayor que 0");
        }

        if (dto.getCategoriaId() == null) {
            throw new DatosNoValidosException("La categoría es obligatoria");
        }

        try {
            categoriaServicio.obtenerPorId(dto.getCategoriaId());
        } catch (RecursoNoEncontradoException e) {
            throw new DatosNoValidosException("La categoría indicada no existe");
        }
    }

    private void comprobarMatriculaUnica(String matricula, Long idIgnorado) {
        for (Vehiculo vehiculo : vehiculos) {
            boolean esOtroVehiculo = idIgnorado == null || !vehiculo.getId().equals(idIgnorado);

            if (esOtroVehiculo && vehiculo.getMatricula().equalsIgnoreCase(matricula)) {
                throw new ConflictoException("Ya existe un vehículo con esa matrícula");
            }
        }
    }

    private void validarFiltros(String marca, Double precioMin, Double precioMax,
                                Long categoriaId, int limite) {
        if (marca != null && marca.isBlank()) {
            throw new DatosNoValidosException("La marca de búsqueda no puede estar vacía");
        }

        if (precioMin != null && precioMin < 0) {
            throw new DatosNoValidosException("El precio mínimo no puede ser negativo");
        }

        if (precioMax != null && precioMax < 0) {
            throw new DatosNoValidosException("El precio máximo no puede ser negativo");
        }

        if (precioMin != null && precioMax != null && precioMin > precioMax) {
            throw new DatosNoValidosException("El precio mínimo no puede ser mayor que el precio máximo");
        }

        if (limite < 0) {
            throw new DatosNoValidosException("El límite no puede ser negativo");
        }

        if (categoriaId != null) {
            categoriaServicio.obtenerPorId(categoriaId);
        }
    }
}
