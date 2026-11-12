# Alquiler Decroly Examen

Proyecto de referencia para preparar el examen de DWES.

La intención es mantener la misma base de **Biblioteca Decroly**: Spring Boot, listas en memoria, capas `controller` / `service` / `model` / `dto` / `exception` / `config`, excepciones propias, `ProblemDetail`, `ResponseEntity` y documentación OpenAPI.

## Entidades

- `CategoriaVehiculo`: tipo de vehículo.
- `Cliente`: persona que realiza alquileres.
- `Vehiculo`: vehículo alquilable. Guarda `categoriaId` y un booleano `disponible`.
- `Alquiler`: relaciona cliente y vehículo. Guarda días, estado activo y precio total.

## Qué ejemplos de examen cubre

Busca en IntelliJ `EJEMPLO EXAMEN -` para localizar rápidamente:

- CRUD completo.
- `201 Created` + cabecera `Location`.
- Búsqueda por campo único (`DNI`, `matrícula`).
- Varios filtros opcionales con `@RequestParam`.
- Rangos numéricos.
- `defaultValue` para limitar resultados.
- Recursos relacionados.
- DTO de respuesta calculado.
- `@ConfigurationProperties`.
- Reglas de negocio con `400`, `404` y `409`.
- Servicio que usa otros servicios.
- Operación especial `PUT /api/alquileres/{id}/devolver`.
- Disponibilidad de un recurso que cambia al crear/devolver un alquiler.

## Regla principal del proyecto

Al crear un alquiler:

1. Deben existir el cliente y el vehículo.
2. Los días deben ser válidos y no superar `alquiler.max-dias`.
3. El vehículo debe estar disponible.
4. El precio total se calcula como `precioDia * dias`.
5. El alquiler queda activo.
6. El vehículo pasa a `disponible = false`.

Al devolverlo ocurre lo contrario: el alquiler queda inactivo y el vehículo vuelve a estar disponible.

## Arranque

1. Abrir en IntelliJ la carpeta que contiene `pom.xml`.
2. Comprobar que el SDK sea Java 21.
3. Esperar a que Maven cargue el proyecto.
4. Ejecutar `AlquilerDecrolyApplication`.
5. La API queda en `http://localhost:8080`.

Swagger UI, si las dependencias están disponibles:

`http://localhost:8080/swagger-ui/index.html`

OpenAPI JSON:

`http://localhost:8080/v3/api-docs`

## Pruebas sin Internet

Puedes usar `curl.exe` contra `localhost`. Ejemplos:

```powershell
curl.exe http://localhost:8080/api/vehiculos
curl.exe http://localhost:8080/api/vehiculos/disponibles
curl.exe "http://localhost:8080/api/vehiculos?precioMin=30&precioMax=80&disponible=true"
curl.exe http://localhost:8080/api/alquileres/activos
```

También se incluye:

- `GUIA_ENDPOINTS_OFFLINE.html`
- `postman/Alquiler Decroly Examen.postman_collection.json`

La colección Postman está pensada para ejecutarse en orden con el servidor recién iniciado y las listas vacías.
