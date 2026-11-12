# Biblioteca Decroly Examen

Copia de la API REST Biblioteca Decroly ampliada como catálogo de ejemplos para preparar el examen de DWES.

En esta primera fase, los datos se almacenan en memoria y la aplicación permite gestionar categorías y libros mediante endpoints en Postman.

## Requisitos

- Java 21
- Maven Wrapper incluido en el proyecto

## Ejecución

Desde la raíz del proyecto, ejecutar:

```bash
.\mvnw spring-boot:run
```

La aplicación se inicia por defecto en:

```text
http://localhost:8080
```

## Endpoints

### Categorías

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/categorias` | Obtiene todas las categorías |
| GET | `/api/categorias/{id}` | Obtiene una categoría por su ID |
| POST | `/api/categorias` | Crea una nueva categoría |
| PUT | `/api/categorias/{id}` | Modifica una categoría existente |
| DELETE | `/api/categorias/{id}` | Elimina una categoría |

### Libros

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/libros` | Obtiene todos los libros |
| GET | `/api/libros?autor={autor}` | Filtra los libros por autor |
| GET | `/api/libros/disponibles` | Obtiene los libros con ejemplares disponibles |
| GET | `/api/libros/{id}` | Obtiene un libro por su ID |
| POST | `/api/libros` | Crea un nuevo libro |
| PUT | `/api/libros/{id}` | Modifica un libro existente |
| DELETE | `/api/libros/{id}` | Elimina un libro |

### Biblioteca

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/biblioteca/info` | Obtiene la información de configuración de la biblioteca |

## Documentación de la API

Con la aplicación en ejecución, la documentación interactiva de Swagger UI está disponible en:

http://localhost:8080/swagger-ui.html

La especificación OpenAPI en formato JSON está disponible en:

http://localhost:8080/v3/api-docs

## Catálogo para el examen

Esta copia incluye ejemplos adicionales pensados para localizar y adaptar rápidamente durante el examen.

Consulta `GUIA_EXAMEN.md` y busca en IntelliJ la etiqueta `EJEMPLO EXAMEN`.

### Endpoints adicionales de ejemplo

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/libros?titulo={texto}` | Filtro parcial por título |
| GET | `/api/libros?anio={anio}` | Filtro por año exacto |
| GET | `/api/libros?desde={anio}` | Libros desde un año |
| GET | `/api/libros?hasta={anio}` | Libros hasta un año |
| GET | `/api/libros?desde={min}&hasta={max}` | Filtro por rango |
| GET | `/api/libros?autor={autor}&titulo={titulo}` | Varios filtros combinados |
| GET | `/api/libros?limite={n}` | Limitar el número de resultados |
| GET | `/api/libros/isbn/{isbn}` | Buscar por un campo único distinto del ID |
| GET | `/api/categorias/{id}/resumen` | Resultado calculado mediante DTO |
| DELETE | `/api/categorias/{id}` | Devuelve 409 si la categoría todavía tiene libros |

Los `POST` de libros y categorías también incluyen ahora la cabecera `Location` mediante `ResponseEntity.created(...)`.
