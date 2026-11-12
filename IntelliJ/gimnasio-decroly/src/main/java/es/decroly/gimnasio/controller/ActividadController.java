package es.decroly.gimnasio.controller;

import es.decroly.gimnasio.dto.ActividadPeticionDto;
import es.decroly.gimnasio.model.Actividad;
import es.decroly.gimnasio.service.ActividadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Tag(name = "Actividades", description = "Operaciones relacionadas con las actividades")
@RestController
@RequestMapping("/api/actividades")
@RequiredArgsConstructor
public class ActividadController {

    private final ActividadService actividadService;
    private final List<Actividad> actividades = new ArrayList<>();
    private final AtomicLong secuencia = new AtomicLong();

    // No he conseguido insertar los datos de ejemplo.
    // Al iniciar la aplicación con el siguiente código descomentado y sin el "final" en ActividadService, la salida es
    // un "500 Internal Server Error"
    /*public ActividadController(Long id, String nombre, String monitor, int plazas, int plazasLibres) {
        anadir(1L, "Pilates", "Laura Gómez", 12, 0);
    }

    private void anadir(Long id, String nombre, String monitor, int plazas, int plazasLibres) {
        id = secuencia.incrementAndGet();
        actividades.add(new Actividad());
    }*/

    @Operation(summary = "Obtener todas las actividades")
    @ApiResponse(responseCode = "200", description = "Lista de actividades obtenida correctamente")
    @GetMapping
    public List<Actividad> listar() {
        return actividadService.listar();
    }

    // Buscar por ID
    @Operation(summary = "Buscar una actividad por ID")
    @ApiResponse(responseCode = "200", description = "Actividad encontrada")
    @ApiResponse(responseCode = "404", description = "Actividad no encontrada")
    @GetMapping("/{id}")
    public Actividad obtenerPorId(@PathVariable Long id) {
        return actividadService.obtenerPorId(id);
    }

    @Operation(summary = "Crear una actividad")
    @ApiResponse(responseCode = "201", description = "Actividad creada")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "409", description = "Ya existe una actividad con ese nombre")
    @PostMapping
    public ResponseEntity<Actividad> crear(@RequestBody Actividad actividad) {
        Actividad actividadCreada = actividadService.crear(actividad);
        URI direccion = URI.create("/api/actividades/" + actividadCreada.getId());

        return ResponseEntity.created(direccion).body(actividadCreada);
    }

    @Operation(summary = "Modificar una actividad")
    @ApiResponse(responseCode = "200", description = "Actividad modificada correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "404", description = "Actividad no encontrada")
    @ApiResponse(responseCode = "409", description = "Ya existe otra actividad con ese nombre")
    @PutMapping("/{id}")
    public Actividad modificar(@PathVariable Long id, @RequestBody Actividad actividad) {
        return actividadService.modificar(id, actividad);
    }

    @Operation(summary = "Eliminar una actividad")
    @ApiResponse(responseCode = "204", description = "Actividad eliminada correctamente")
    @ApiResponse(responseCode = "404", description = "Actividad no encontrada")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        actividadService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
