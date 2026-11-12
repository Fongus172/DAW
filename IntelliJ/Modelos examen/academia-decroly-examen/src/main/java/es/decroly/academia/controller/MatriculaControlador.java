package es.decroly.academia.controller;

import es.decroly.academia.dto.MatriculaPeticionDto;
import es.decroly.academia.model.Matricula;
import es.decroly.academia.service.MatriculaServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Tag(name = "Matrículas", description = "Operaciones relacionadas con las matrículas")
@RestController
@RequestMapping("/api/matriculas")
@RequiredArgsConstructor
public class MatriculaControlador {

    private final MatriculaServicio matriculaServicio;

    // EJEMPLO EXAMEN - VARIOS FILTROS OPCIONALES + defaultValue
    @Operation(summary = "Listar matrículas y aplicar filtros opcionales")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @ApiResponse(responseCode = "400", description = "Algún filtro no es válido")
    @ApiResponse(responseCode = "404", description = "Alumno o curso usado como filtro no existe")
    @GetMapping
    public List<Matricula> listar(
            @Parameter(example = "true") @RequestParam(required = false) Boolean activa,
            @Parameter(example = "1") @RequestParam(required = false) Long alumnoId,
            @Parameter(example = "1") @RequestParam(required = false) Long cursoId,
            @Parameter(description = "0 significa sin límite", example = "5")
            @RequestParam(defaultValue = "0") int limite) {
        return matriculaServicio.filtrar(activa, alumnoId, cursoId, limite);
    }

    @Operation(summary = "Listar únicamente las matrículas activas")
    @GetMapping("/activas")
    public List<Matricula> listarActivas() {
        return matriculaServicio.listarActivas();
    }

    @Operation(summary = "Buscar una matrícula por ID")
    @ApiResponse(responseCode = "404", description = "Matrícula no encontrada")
    @GetMapping("/{id}")
    public Matricula obtenerPorId(@PathVariable Long id) {
        return matriculaServicio.obtenerPorId(id);
    }

    // EJEMPLO EXAMEN - CREAR RECURSO + 201 CREATED + LOCATION
    @Operation(summary = "Matricular un alumno en un curso")
    @ApiResponse(responseCode = "201", description = "Matrícula creada correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "409", description = "Sin plazas, matrícula repetida o límite del alumno alcanzado")
    @PostMapping
    public ResponseEntity<Matricula> crear(@RequestBody MatriculaPeticionDto dto) {
        Matricula creada = matriculaServicio.crear(dto);
        URI direccion = URI.create("/api/matriculas/" + creada.getId());
        return ResponseEntity.created(direccion).body(creada);
    }

    @Operation(summary = "Modificar una matrícula activa")
    @ApiResponse(responseCode = "200", description = "Matrícula modificada correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "404", description = "Matrícula no encontrada")
    @ApiResponse(responseCode = "409", description = "La operación incumple una regla de negocio")
    @PutMapping("/{id}")
    public Matricula modificar(@PathVariable Long id, @RequestBody MatriculaPeticionDto dto) {
        return matriculaServicio.modificar(id, dto);
    }

    // EJEMPLO EXAMEN - OPERACIÓN ESPECÍFICA QUE CAMBIA ESTADO
    @Operation(summary = "Cancelar una matrícula")
    @ApiResponse(responseCode = "200", description = "Matrícula cancelada correctamente")
    @ApiResponse(responseCode = "404", description = "Matrícula no encontrada")
    @ApiResponse(responseCode = "409", description = "La matrícula ya estaba cancelada")
    @PutMapping("/{id}/cancelar")
    public Matricula cancelar(@PathVariable Long id) {
        return matriculaServicio.cancelar(id);
    }

    @Operation(summary = "Eliminar una matrícula cancelada")
    @ApiResponse(responseCode = "204", description = "Matrícula eliminada correctamente")
    @ApiResponse(responseCode = "404", description = "Matrícula no encontrada")
    @ApiResponse(responseCode = "409", description = "La matrícula sigue activa")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        matriculaServicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
