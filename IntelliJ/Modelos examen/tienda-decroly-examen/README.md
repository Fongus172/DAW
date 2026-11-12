# Tienda Decroly Examen

Proyecto de referencia para preparar el examen de DWES. Mantiene la misma base de Biblioteca Decroly Fase 1:

- Spring Boot + Maven + Java 21.
- Datos en memoria mediante `ArrayList`.
- Paquetes `model`, `dto`, `service`, `controller`, `exception` y `config`.
- Interfaces de servicio + clases `ServicioImpl`.
- Inyección por constructor con Lombok (`@RequiredArgsConstructor`).
- Errores 400, 404 y 409 mediante excepciones propias y `ProblemDetail`.
- OpenAPI/springdoc con Swagger UI.
- Sin base de datos, JPA, repositorios, seguridad ni contenidos ajenos a esta parte de la asignatura.

## Abrir en IntelliJ

1. Descomprime el ZIP.
2. Abre IntelliJ IDEA.
3. `File > Open` y selecciona la carpeta que contiene `pom.xml`.
4. Comprueba que el SDK del proyecto sea Java 21.
5. Ejecuta `TiendaDecrolyApplication`.
6. La API queda en `http://localhost:8080`.

## OpenAPI

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- JSON OpenAPI: `http://localhost:8080/v3/api-docs`

## Material incluido

- `GUIA_ENDPOINTS_OFFLINE.html`: catálogo que se puede abrir sin Internet.
- `postman/Tienda Decroly Examen.postman_collection.json`: colección importable en Postman.
- Comentarios `EJEMPLO EXAMEN - ...` en el código. Usa `Ctrl+Shift+F` en IntelliJ para encontrarlos.

## Palabras útiles para buscar en el código

`VARIOS FILTROS OPCIONALES`, `CAMPO ÚNICO`, `RECURSOS RELACIONADOS`, `RESULTADO CALCULADO`, `REGLA AL BORRAR`, `STOCK`, `LOCATION`, `CONFIGURATIONPROPERTIES`.
