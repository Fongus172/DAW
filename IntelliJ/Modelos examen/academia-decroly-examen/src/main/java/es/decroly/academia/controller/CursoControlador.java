package es.decroly.academia.controller;

import es.decroly.academia.dto.CursoResumenDto;
import es.decroly.academia.model.Alumno;
import es.decroly.academia.model.Curso;
import es.decroly.academia.model.Matricula;
import es.decroly.academia.service.AcademiaGestionServicio;
import es.decroly.academia.service.CursoServicio;
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

@Tag(name = "Cursos", description = "Operaciones relacionadas con los cursos")
@RestController
@RequestMapping("/api/cursos")
@RequiredArgsConstructor
public class CursoControlador {

    private final CursoServicio cursoServicio;
    private final MatriculaServicio matriculaServicio;
    private final AcademiaGestionServicio gestionServicio;

    // EJEMPLO EXAMEN - VARIOS FILTROS OPCIONALES + RANGO + defaultValue
    @Operation(summary = "Listar cursos y aplicar filtros opcionales")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @ApiResponse(responseCode = "400", description = "Algún filtro no es válido")
    @GetMapping
    public List<Curso> listar(
            @RequestParam(required = false) String nombre,
            @Parameter(example = "100") @RequestParam(required = false) Double precioMin,
            @Parameter(example = "300") @RequestParam(required = false) Double precioMax,
            @Parameter(description = "0 significa sin límite", example = "5")
            @RequestParam(defaultValue = "0") int limite) {
        return cursoServicio.filtrar(nombre, precioMin, precioMax, limite);
    }

    @Operation(summary = "Listar cursos que todavía tienen alguna plaza disponible")
    @GetMapping("/con-plazas")
    public List<Curso> listarConPlazas() {
        return gestionServicio.listarCursosConPlazas();
    }

    // EJEMPLO EXAMEN - BUSCAR POR CAMPO ÚNICO
    @Operation(summary = "Buscar un curso por código")
    @ApiResponse(responseCode = "200", description = "Curso encontrado")
    @ApiResponse(responseCode = "400", description = "Código no válido")
    @ApiResponse(responseCode = "404", description = "Curso no encontrado")
    @GetMapping("/codigo/{codigo}")
    public Curso obtenerPorCodigo(@Parameter(example = "JAVA-01") @PathVariable String codigo) {
        return cursoServicio.obtenerPorCodigo(codigo);
    }

    @Operation(summary = "Buscar un curso por ID")
    @ApiResponse(responseCode = "404", description = "Curso no encontrado")
    @GetMapping("/{id}")
    public Curso obtenerPorId(@PathVariable Long id) {
        return cursoServicio.obtenerPorId(id);
    }

    // EJEMPLO EXAMEN - RECURSOS RELACIONADOS
    @Operation(summary = "Obtener todas las matrículas de un curso")
    @GetMapping("/{id}/matriculas")
    public List<Matricula> listarMatriculas(@PathVariable Long id) {
        return matriculaServicio.listarPorCurso(id);
    }

    // EJEMPLO EXAMEN - RECURSOS RELACIONADOS TRANSFORMADOS
    @Operation(summary = "Obtener los alumnos actualmente matriculados en un curso")
    @GetMapping("/{id}/alumnos")
    public List<Alumno> listarAlumnos(@PathVariable Long id) {
        return gestionServicio.listarAlumnosActivosDeCurso(id);
    }

    // EJEMPLO EXAMEN - RESULTADO CALCULADO CON DTO
    @Operation(summary = "Obtener un resumen calculado de un curso")
    @GetMapping("/{id}/resumen")
    public CursoResumenDto obtenerResumen(@PathVariable Long id) {
        return gestionServicio.obtenerResumenCurso(id);
    }

    @Operation(summary = "Crear un curso")
    @ApiResponse(responseCode = "201", description = "Curso creado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "409", description = "Código repetido")
    @PostMapping
    public ResponseEntity<Curso> crear(@RequestBody Curso curso) {
        Curso creado = cursoServicio.crear(curso);
        URI direccion = URI.create("/api/cursos/" + creado.getId());
        return ResponseEntity.created(direccion).body(creado);
    }

    @Operation(summary = "Modificar un curso")
    @ApiResponse(responseCode = "200", description = "Curso modificado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos no válidos")
    @ApiResponse(responseCode = "404", description = "Curso no encontrado")
    @ApiResponse(responseCode = "409", description = "Código repetido o plazas incompatibles con las matrículas actuales")
    @PutMapping("/{id}")
    public Curso modificar(@PathVariable Long id, @RequestBody Curso curso) {
        return gestionServicio.modificarCursoRespetandoPlazas(id, curso);
    }

    @Operation(summary = "Eliminar un curso si nunca ha tenido matrículas")
    @ApiResponse(responseCode = "204", description = "Curso eliminado correctamente")
    @ApiResponse(responseCode = "404", description = "Curso no encontrado")
    @ApiResponse(responseCode = "409", description = "El curso tiene matrículas asociadas")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        gestionServicio.eliminarCursoSiNoTieneMatriculas(id);
        return ResponseEntity.noContent().build();
    }
}
