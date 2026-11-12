package es.decroly.tienda.service;

import es.decroly.tienda.dto.ProductoPeticionDto;
import es.decroly.tienda.exception.ConflictoException;
import es.decroly.tienda.exception.DatosNoValidosException;
import es.decroly.tienda.exception.RecursoNoEncontradoException;
import es.decroly.tienda.model.Producto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoServicioImpl implements ProductoServicio {

    // Los productos se almacenan en memoria, exactamente igual que los libros de Biblioteca Decroly.
    private final List<Producto> productos = new ArrayList<>();
    private Long siguienteId = 1L;

    private final CategoriaServicio categoriaServicio;

    // EJEMPLO EXAMEN - VARIOS FILTROS OPCIONALES
    // Un parámetro null significa que ese filtro no se aplica.
    // Si ningún producto coincide, se devuelve [] con 200 OK. No se lanza 404.
    @Override
    public List<Producto> filtrar(String nombre, Double precioMin, Double precioMax,
                                  Long categoriaId, int limite) {
        validarFiltros(nombre, precioMin, precioMax, categoriaId, limite);

        List<Producto> resultado = new ArrayList<>();

        for (Producto producto : productos) {
            boolean coincide = true;

            if (nombre != null
                    && !producto.getNombre().toLowerCase().contains(nombre.toLowerCase())) {
                coincide = false;
            }

            if (precioMin != null && producto.getPrecio() < precioMin) {
                coincide = false;
            }

            if (precioMax != null && producto.getPrecio() > precioMax) {
                coincide = false;
            }

            if (categoriaId != null && !producto.getCategoriaId().equals(categoriaId)) {
                coincide = false;
            }

            if (coincide) {
                resultado.add(producto);

                if (limite > 0 && resultado.size() >= limite) {
                    break;
                }
            }
        }

        return resultado;
    }

    @Override
    public List<Producto> listarDisponibles() {
        List<Producto> resultado = new ArrayList<>();

        for (Producto producto : productos) {
            if (producto.getStock() > 0) {
                resultado.add(producto);
            }
        }

        return resultado;
    }

    @Override
    public Producto obtenerPorId(Long id) {
        for (Producto producto : productos) {
            if (producto.getId().equals(id)) {
                return producto;
            }
        }

        throw new RecursoNoEncontradoException("No existe ningún producto con ID " + id);
    }

    // EJEMPLO EXAMEN - BUSCAR POR CAMPO ÚNICO
    // El código identifica un producto igual que el ISBN identifica un libro.
    // Un código vacío es un dato inválido (400); un código válido que no existe produce 404.
    @Override
    public Producto obtenerPorCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new DatosNoValidosException("El código del producto no puede estar vacío");
        }

        for (Producto producto : productos) {
            if (producto.getCodigo().equalsIgnoreCase(codigo)) {
                return producto;
            }
        }

        throw new RecursoNoEncontradoException(
                "No existe ningún producto con el código " + codigo
        );
    }

    @Override
    public Producto crear(ProductoPeticionDto productoPeticionDto) {
        validarProducto(productoPeticionDto);
        comprobarCodigoUnico(productoPeticionDto.getCodigo(), null);

        Producto producto = new Producto();
        producto.setId(siguienteId);
        siguienteId++;
        copiarDatos(producto, productoPeticionDto);

        productos.add(producto);
        return producto;
    }

    @Override
    public Producto modificar(Long id, ProductoPeticionDto productoPeticionDto) {
        Producto productoExistente = obtenerPorId(id);

        validarProducto(productoPeticionDto);
        comprobarCodigoUnico(productoPeticionDto.getCodigo(), id);
        copiarDatos(productoExistente, productoPeticionDto);

        return productoExistente;
    }

    @Override
    public void eliminar(Long id) {
        Producto producto = obtenerPorId(id);
        productos.remove(producto);
    }

    @Override
    public List<Producto> listarPorCategoria(Long categoriaId) {
        // Primero comprobamos que la categoría realmente exista.
        categoriaServicio.obtenerPorId(categoriaId);

        List<Producto> resultado = new ArrayList<>();
        for (Producto producto : productos) {
            if (producto.getCategoriaId().equals(categoriaId)) {
                resultado.add(producto);
            }
        }

        return resultado;
    }

    // EJEMPLO EXAMEN - MÉTODO AUXILIAR DE SERVICIO
    // Una diferencia negativa resta stock y una positiva lo suma.
    // Se usa desde PedidoServicio al crear, modificar o eliminar un pedido.
    @Override
    public void cambiarStock(Long productoId, int diferencia) {
        Producto producto = obtenerPorId(productoId);
        int nuevoStock = producto.getStock() + diferencia;

        if (nuevoStock < 0) {
            throw new ConflictoException(
                    "No hay stock suficiente del producto " + producto.getNombre()
            );
        }

        producto.setStock(nuevoStock);
    }

    private void copiarDatos(Producto producto, ProductoPeticionDto dto) {
        producto.setCodigo(dto.getCodigo());
        producto.setNombre(dto.getNombre());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());
        producto.setCategoriaId(dto.getCategoriaId());
    }

    private void comprobarCodigoUnico(String codigo, Long idQueSeEstaModificando) {
        for (Producto producto : productos) {
            boolean esOtroProducto = idQueSeEstaModificando == null
                    || !producto.getId().equals(idQueSeEstaModificando);

            if (esOtroProducto && producto.getCodigo().equalsIgnoreCase(codigo)) {
                throw new ConflictoException(
                        "Ya existe un producto con el código " + codigo
                );
            }
        }
    }

    private void validarProducto(ProductoPeticionDto dto) {
        if (dto.getCodigo() == null || dto.getCodigo().isBlank()) {
            throw new DatosNoValidosException("El código del producto es obligatorio");
        }

        if (dto.getNombre() == null || dto.getNombre().isBlank()) {
            throw new DatosNoValidosException("El nombre del producto es obligatorio");
        }

        if (dto.getPrecio() <= 0) {
            throw new DatosNoValidosException("El precio del producto debe ser mayor que 0");
        }

        if (dto.getStock() < 0) {
            throw new DatosNoValidosException("El stock no puede ser negativo");
        }

        if (dto.getCategoriaId() == null) {
            throw new DatosNoValidosException("La categoría es obligatoria");
        }

        // Si el ID de categoría no existe, los datos enviados para el producto no son válidos.
        try {
            categoriaServicio.obtenerPorId(dto.getCategoriaId());
        } catch (RecursoNoEncontradoException e) {
            throw new DatosNoValidosException("La categoría indicada no existe");
        }
    }

    private void validarFiltros(String nombre, Double precioMin, Double precioMax,
                                Long categoriaId, int limite) {
        if (nombre != null && nombre.isBlank()) {
            throw new DatosNoValidosException("El nombre de búsqueda no puede estar vacío");
        }

        if (precioMin != null && precioMin < 0) {
            throw new DatosNoValidosException("El precio mínimo no puede ser negativo");
        }

        if (precioMax != null && precioMax < 0) {
            throw new DatosNoValidosException("El precio máximo no puede ser negativo");
        }

        if (precioMin != null && precioMax != null && precioMin > precioMax) {
            throw new DatosNoValidosException(
                    "El precio mínimo no puede ser mayor que el precio máximo"
            );
        }

        if (limite < 0) {
            throw new DatosNoValidosException("El límite no puede ser negativo");
        }

        if (categoriaId != null) {
            categoriaServicio.obtenerPorId(categoriaId);
        }
    }
}
