package es.decroly.academia.controller;

import es.decroly.academia.model.Alumno;
import es.decroly.academia.model.Curso;
import es.decroly.academia.model.Matricula;
import es.decroly.academia.service.AcademiaGestionServicio;
import es.decroly.academia.service.AlumnoServicio;
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

@Tag(name = "Alumnos", description = "Operaciones relacionadas con los alumnos")
@RestController
@RequestMapping("/api/alumnos")
@RequiredArgsConstructor
public class AlumnoControlador {

    private final AlumnoServicio alumnoServicio;
    private final MatriculaServicio matriculaServicio;
    private final AcademiaGestionServicio gestionServicio;

    // EJEMPLO EXAMEN - FILTRO DE TEXTO + defaultValue
    @Operation(summary = "Listar alumnos y filtrar opcionalmente por nombre")
    @GetMapping
    public List<Alumno> listar(
            @RequestParam(required = false) String nombre,
            @RequestParam(defaultValue = "0") int limite) {
        return alumnoServicio.filtrar(nombre, limite);
    }

    // EJEMPLO EXAMEN - BUSCAR POR CAMPO ÚNICO
    @Operation(summary = "Buscar un alumno por DNI")
    @ApiResponse(responseCode = "400", description = "DNI no válido")
    @ApiResponse(responseCode = "404", description = "Alumno no encontrado")
    @GetMapping("/dni/{dni}")
    public Alumno obtenerPorDni(@Parameter(example = "12345678A") @PathVariable String dni) {
        return alumnoServicio.obtenerPorDni(dni);
    }

    @Operation(summary = "Buscar un alumno por ID")
    @ApiResponse(responseCode = "404", description = "Alumno no encontrado")
    @GetMapping("/{id}")
    public Alumno obtenerPorId(@PathVariable Long id) {
        return alumnoServicio.obtenerPorId(id);
    }

    // EJEMPLO EXAMEN - RECURSOS RELACIONADOS
    @Operation(summary = "Obtener todas las matrículas de un alumno")
    @GetMapping("/{id}/matriculas")
    public List<Matricula> listarMatriculas(@PathVariable Long id) {
        return matriculaServicio.listarPorAlumno(id);
    }

    // EJEMPLO EXAMEN - RELACIÓN EN SENTIDO CONTRARIO
    @Operation(summary = "Obtener los cursos en los que el alumno está matriculado actualmente")
    @GetMapping("/{id}/cursos")
    public List<Curso> listarCursos(@PathVariable Long id) {
        return gestionServicio.listarCursosActivosDeAlumno(id);
    }

    @Operation(summary = "Crear un alumno")
    @ApiResponse(responseCode = "201", description = "Alumno creado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "409", description = "DNI repetido")
    @PostMapping
    public ResponseEntity<Alumno> crear(@RequestBody Alumno alumno) {
        Alumno creado = alumnoServicio.crear(alumno);
        URI direccion = URI.create("/api/alumnos/" + creado.getId());
        return ResponseEntity.created(direccion).body(creado);
    }

    @Operation(summary = "Modificar un alumno")
    @PutMapping("/{id}")
    public Alumno modificar(@PathVariable Long id, @RequestBody Alumno alumno) {
        return alumnoServicio.modificar(id, alumno);
    }

    @Operation(summary = "Eliminar un alumno si nunca ha tenido matrículas")
    @ApiResponse(responseCode = "204", description = "Alumno eliminado correctamente")
    @ApiResponse(responseCode = "404", description = "Alumno no encontrado")
    @ApiResponse(responseCode = "409", description = "El alumno tiene matrículas asociadas")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        gestionServicio.eliminarAlumnoSiNoTieneMatriculas(id);
        return ResponseEntity.noContent().build();
    }
}
