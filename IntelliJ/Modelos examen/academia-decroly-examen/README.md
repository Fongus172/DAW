# Academia Decroly Examen

Proyecto de referencia para el examen de DWES. Mantiene la misma estructura base que Biblioteca Decroly: Spring Boot, capas Controller/Service, listas en memoria, DTOs sencillos, excepciones propias, ProblemDetail, ConfigurationProperties y OpenAPI.

## Entidades

- `Curso`: código único, nombre, plazas máximas y precio.
- `Alumno`: DNI único, nombre y email.
- `Matricula`: relaciona un alumno con un curso y puede estar activa o cancelada.

## Qué ejemplos aporta

- CRUD completo de cursos, alumnos y matrículas.
- Búsqueda por campo único: código de curso y DNI.
- Filtros opcionales y rangos de precio.
- Relaciones: curso -> matrículas -> alumnos y alumno -> matrículas -> cursos.
- Regla de plazas máximas.
- Regla de máximo de matrículas activas por alumno desde `application.properties`.
- Conflicto 409 por matrícula repetida.
- Operación especial `PUT /api/matriculas/{id}/cancelar`.
- DTO calculado `CursoResumenDto`.
- `201 Created` con cabecera `Location`.
- OpenAPI/Swagger.

## Arranque

Abrir en IntelliJ la carpeta que contiene `pom.xml`, dejar que Maven cargue las dependencias y ejecutar `AcademiaDecrolyApplication`.

Swagger UI: `http://localhost:8080/swagger-ui/index.html`

OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Consulta offline

Abrir `GUIA_ENDPOINTS_OFFLINE.html` con doble clic. No necesita Internet ni que la aplicación esté arrancada.

## Postman

Importar `postman/Academia Decroly Examen.postman_collection.json`. La variable `baseUrl` ya vale `http://localhost:8080`.
