# Taller Decroly Examen

Proyecto de referencia para preparar el examen de DWES.

La estructura sigue la misma base utilizada en **Biblioteca Decroly** y en **Tienda Decroly Examen**:

- Spring Boot 4.1.1
- Java 21
- Maven
- datos almacenados en listas en memoria
- paquetes `controller`, `service`, `model`, `dto`, `exception` y `config`
- interfaces de servicio y sus implementaciones
- excepciones propias y `ProblemDetail`
- OpenAPI / Swagger mediante springdoc 3.2.0
- Lombok

No utiliza JPA, Repository, base de datos, seguridad, PATCH, enums ni contenidos ajenos a la Fase 1 de Biblioteca Decroly y a la teoría trabajada.

## Entidades

### Cliente

- `id`
- `dni`
- `nombre`
- `telefono`

El DNI es único.

### Vehiculo

- `id`
- `matricula`
- `marca`
- `modelo`
- `clienteId`

La matrícula es única y cada vehículo pertenece a un cliente existente.

### Reparacion

- `id`
- `vehiculoId`
- `descripcion`
- `estado`
- `coste`

Estados admitidos: `PENDIENTE`, `EN_CURSO` y `FINALIZADA`.

## Endpoints principales

### Taller

- `GET /api/taller/info`

### Clientes

- `GET /api/clientes`
- `GET /api/clientes/{id}`
- `GET /api/clientes/dni/{dni}`
- `GET /api/clientes/{id}/vehiculos`
- `POST /api/clientes`
- `PUT /api/clientes/{id}`
- `DELETE /api/clientes/{id}`

### Vehículos

- `GET /api/vehiculos`
- `GET /api/vehiculos?marca=Toyota`
- `GET /api/vehiculos?clienteId=1`
- `GET /api/vehiculos?marca=Toyota&clienteId=1&limite=5`
- `GET /api/vehiculos/matricula/{matricula}`
- `GET /api/vehiculos/{id}`
- `GET /api/vehiculos/{id}/reparaciones`
- `GET /api/vehiculos/{id}/resumen`
- `POST /api/vehiculos`
- `PUT /api/vehiculos/{id}`
- `DELETE /api/vehiculos/{id}`

### Reparaciones

- `GET /api/reparaciones`
- `GET /api/reparaciones?estado=PENDIENTE`
- `GET /api/reparaciones?costeMin=100&costeMax=500`
- `GET /api/reparaciones?vehiculoId=1&limite=3`
- `GET /api/reparaciones/activas`
- `GET /api/reparaciones/{id}`
- `POST /api/reparaciones`
- `PUT /api/reparaciones/{id}`
- `PUT /api/reparaciones/{id}/finalizar`
- `DELETE /api/reparaciones/{id}`

## Reglas de negocio que sirve de ejemplo

- DNI de cliente único -> `409 Conflict` si se repite.
- Matrícula única -> `409 Conflict` si se repite.
- No se puede crear un vehículo para un cliente inexistente -> `400 Bad Request`.
- No se puede borrar un cliente que todavía tiene vehículos -> `409 Conflict`.
- No se puede borrar un vehículo que todavía tiene reparaciones -> `409 Conflict`.
- Una reparación debe tener un estado válido y coste no negativo -> `400 Bad Request`.
- Cada vehículo tiene un máximo de reparaciones activas configurable -> `409 Conflict` al superarlo.
- Finalizar una reparación ya finalizada -> `409 Conflict`.
- Buscar un ID, DNI o matrícula válidos que no existen -> `404 Not Found`.
- Un filtro sin coincidencias devuelve `200 OK` y `[]`, no `404`.

## Configuración

`application.properties`:

```properties
spring.application.name=taller-decroly-examen

taller.nombre=Taller Decroly
taller.max-reparaciones-activas=3
```

La clase `TallerPropiedades` utiliza `@ConfigurationProperties(prefix = "taller")`.

## Swagger / OpenAPI

Con la aplicación arrancada:

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- JSON OpenAPI: `http://localhost:8080/v3/api-docs`

## Postman

La colección exportada está en:

`postman/Taller Decroly Examen.postman_collection.json`

Está pensada para ejecutarse con la aplicación recién arrancada, porque los datos viven únicamente en memoria.

## Consulta offline

Abre `GUIA_ENDPOINTS_OFFLINE.html` con doble clic. No necesita Internet ni que Spring Boot esté arrancado.

En IntelliJ también puedes buscar `EJEMPLO EXAMEN` para encontrar rápidamente los patrones importantes.
