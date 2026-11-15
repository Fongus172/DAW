# CatalogoSeriesBackend

Proyecto modelo de DWEC para practicar el patrón utilizado por el profesor en `SeriesFetchApp`:

- Angular standalone.
- Interfaz `ISerie`.
- Servicio compartido con `@Service()`.
- Inyección mediante `inject()`.
- Petición GET con `fetch()`.
- Conversión de respuesta mediante `response.json()`.
- Array compartido entre componentes.
- Formulario Reactive para añadir elementos de forma local.
- Listado mediante `@for`.
- Tarjeta hija mediante `@Input()`.
- Eliminación local mediante servicio.
- Estado de carga y error de conexión.

## Ejecutar

```bat
npm install
ng s -o
```

La API usada es la misma del ejemplo del profesor:

`https://peticiones.online/api/series`

Consulta `README_EXAMEN.md` para la guía detallada.
