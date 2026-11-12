# Biblioteca Decroly Examen - Catálogo rápido

Este proyecto es una copia de `biblioteca-decroly` preparada como catálogo de ejemplos para el examen de DWES.

La idea no es memorizar todo. Durante el examen puedes usar **Ctrl + Shift + F** en IntelliJ y buscar las palabras `EJEMPLO EXAMEN` o una de las etiquetas de esta guía.

## 1. CRUD básico

Ya estaba en el proyecto original.

- `GET /api/libros` - listar recursos.
- `GET /api/libros/{id}` - buscar un recurso concreto por ID.
- `POST /api/libros` - crear un recurso.
- `PUT /api/libros/{id}` - modificar un recurso completo.
- `DELETE /api/libros/{id}` - eliminar un recurso.
- Lo mismo existe para categorías.

**Busca:** `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`.

## 2. FILTRO TEXTO

Sirve cuando el enunciado pide buscar elementos cuyo texto contenga una palabra.

Ejemplos:

```text
GET /api/libros?autor=Cervantes
GET /api/libros?titulo=Quijote
```

No distingue mayúsculas y minúsculas.

**Busca:** `EJEMPLO EXAMEN - FILTRO TEXTO`.

## 3. FILTRO NUMÉRICO EXACTO

Sirve cuando el enunciado pide elementos cuyo número sea exactamente el indicado.

Ejemplo:

```text
GET /api/libros?anio=1605
```

**Busca:** `FILTRO NUMÉRICO EXACTO`.

## 4. FILTRO DESDE / HASTA

Sirve para comparaciones de tipo mayor o igual / menor o igual.

Ejemplos:

```text
GET /api/libros?desde=2000
GET /api/libros?hasta=2000
```

**Busca:** `FILTRO DESDE UN AÑO` o `FILTRO HASTA UN AÑO`.

## 5. FILTRO POR RANGO

Sirve cuando un valor debe estar entre un mínimo y un máximo.

Ejemplo:

```text
GET /api/libros?desde=2000&hasta=2020
```

Si `desde` es mayor que `hasta`, se devuelve `400 Bad Request`.

**Busca:** `FILTRO POR RANGO`.

## 6. VARIOS FILTROS OPCIONALES

Sirve cuando una misma petición puede recibir varios filtros y el cliente decide cuáles enviar.

Ejemplo:

```text
GET /api/libros?autor=Cervantes&titulo=Quijote&desde=1500&hasta=1700
```

Los parámetros que no llegan se ignoran.

**Busca:** `EJEMPLO EXAMEN - VARIOS FILTROS OPCIONALES`.

## 7. VALOR POR DEFECTO

Sirve cuando un parámetro debe tener un valor automático si el cliente no lo envía.

En este proyecto:

```java
@RequestParam(defaultValue = "0") int limite
```

`0` significa que no hay límite. Por ejemplo:

```text
GET /api/libros?limite=5
```

**Busca:** `defaultValue` o `LÍMITE DE RESULTADOS`.

## 8. BUSCAR POR CAMPO ÚNICO

Sirve cuando el recurso tiene otro campo que también lo identifica de forma única.

Ejemplo con ISBN:

```text
GET /api/libros/isbn/9781234567890
```

- ISBN con formato incorrecto -> `400`.
- ISBN válido que no existe -> `404`.

**Busca:** `EJEMPLO EXAMEN - BUSCAR POR CAMPO ÚNICO`.

## 9. RECURSOS RELACIONADOS

Sirve para obtener los recursos que pertenecen a otro recurso.

Ejemplo:

```text
GET /api/categorias/{id}/libros
```

Primero se comprueba que la categoría existe. Una categoría válida sin libros devuelve `200` y una lista vacía.

**Busca:** `listarPorCategoria`.

## 10. RESULTADO CALCULADO CON DTO

Sirve cuando el endpoint no devuelve directamente un Libro o una Categoría, sino información calculada.

Ejemplo:

```text
GET /api/categorias/{id}/resumen
```

Devuelve:

- ID y nombre de la categoría.
- número de libros;
- total de ejemplares;
- total de ejemplares disponibles.

El resultado usa `CategoriaResumenDto`.

**Busca:** `EJEMPLO EXAMEN - RESULTADO CALCULADO`.

## 11. SERVICIO QUE USA OTROS SERVICIOS

Sirve cuando una regla necesita datos de varias partes de la aplicación.

`BibliotecaGestionServicio` usa `CategoriaServicio` y `LibroServicio` para calcular el resumen y para aplicar la regla de borrado.

Esto permite mantener la lógica fuera del Controller.

**Busca:** `EJEMPLO EXAMEN - SERVICIO QUE USA OTROS SERVICIOS`.

## 12. REGLA AL BORRAR

Sirve cuando el DELETE solo se permite si se cumple una condición.

En este proyecto no se puede borrar una categoría mientras tenga libros asociados:

```text
DELETE /api/categorias/{id}
```

- categoría vacía -> `204 No Content`;
- categoría con libros -> `409 Conflict`;
- categoría inexistente -> `404 Not Found`.

**Busca:** `EJEMPLO EXAMEN - REGLA AL BORRAR`.

## 13. RESPONSEENTITY CREATED + LOCATION

Un POST correcto puede devolver `201 Created`, el objeto creado y una cabecera `Location` que indica dónde consultar el nuevo recurso.

Está aplicado en la creación de libros y categorías:

```java
URI direccion = URI.create("/api/libros/" + libroCreado.getId());
return ResponseEntity.created(direccion).body(libroCreado);
```

**Busca:** `EJEMPLO EXAMEN - RESPONSEENTITY CREATED + LOCATION`.

## 14. ERRORES IMPORTANTES

El proyecto conserva el manejador global con `ProblemDetail`.

- `400 Bad Request` - datos o parámetros inválidos.
- `404 Not Found` - se busca un recurso concreto que no existe.
- `409 Conflict` - el dato entra en conflicto con el estado actual, por ejemplo un duplicado o intentar borrar una categoría que todavía tiene libros.

Regla útil:

- filtro válido sin coincidencias -> `200` y `[]`;
- recurso concreto inexistente -> `404`.

## 15. Cosas de la teoría que NO se han añadido todavía a esta copia

Para que este catálogo no mezcle demasiados conceptos de golpe, esta primera ampliación no implementa todavía:

- consumo de APIs externas con `RestClient`;
- error `503 Service Unavailable`;
- varias implementaciones de un mismo Service con `@Primary`, `@Qualifier` o `@ConditionalOnProperty`;
- perfiles de Spring;
- `PATCH`.

`PATCH` aparece explicado como concepto en la teoría, pero el CRUD práctico trabajado se centra en `PUT`, por lo que no se ha añadido como ejemplo principal.

## 16. Postman

La colección `postman/Biblioteca Decroly Examen.postman_collection.json` incluye una carpeta llamada `EJEMPLOS EXAMEN` con pruebas preparadas para los casos anteriores.

Antes de ejecutar toda la colección, reinicia Spring Boot para empezar con las listas en memoria vacías.
