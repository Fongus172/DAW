# CHULETA DE EXAMEN - ANGULAR + FETCH + BACKEND

Este proyecto está construido siguiendo el patrón real de `SeriesFetchApp` del profesor.

## 1. Qué hace realmente este proyecto

El backend/API devuelve un JSON con series.

Flujo:

```text
API / BACKEND
     |
     | fetch(url)
     v
SeriesServices
     |
     | ISerie[]
     v
SerieList
     |
     | [miSerie]
     v
SerieCard
```

Por separado:

```text
SerieForm
    |
    | addSerie(...)
    v
SeriesServices
```

IMPORTANTE: igual que en el ejemplo del profesor, `fetch` se usa para LEER los datos. Añadir y eliminar modifican el array local del frontend. No hacen POST ni DELETE en el servidor.

---

## 2. Paso 1 - Averiguar qué devuelve el backend

Si el profesor entrega un backend en ZIP:

1. Arrancarlo.
2. Buscar qué puerto utiliza.
3. Buscar el endpoint del controlador.
4. Probar el endpoint en navegador o Postman.
5. Mirar EXACTAMENTE el JSON que devuelve.

Ejemplo:

```json
{
    "id": 1,
    "title": "Juego de Tronos",
    "creator": "David Benioff",
    "rating": 9.2
}
```

Los nombres de la interfaz Angular deben coincidir con las propiedades del JSON.

---

## 3. Crear la interfaz

```ts
export interface ISerie {
    id: number;
    title: string;
    creator: string;
    rating: number;
}
```

Si el backend devuelve `title`, no inventes `titulo` en Angular salvo que después hagas una conversión.

---

## 4. Crear el servicio

Comando:

```bat
ng g s services/series-services --skip-tests
```

Patrón del profesor en Angular 22:

```ts
import { Service } from "@angular/core";

@Service()
export class SeriesServices {
}
```

El servicio guarda el array:

```ts
private arrSeries: ISerie[];
```

Y una URL:

```ts
private url: string = "https://peticiones.online/api/series";
```

---

## 5. FETCH - PARTE MÁS IMPORTANTE

Patrón básico:

```ts
fetch(this.url)
    .then((response) => response.json())
    .then((datos) => {
        console.log(datos);
    });
```

Qué ocurre:

```text
fetch(url)
    |
    v
respuesta HTTP
    |
    | response.json()
    v
objeto/array JavaScript
    |
    v
.then(datos => ...)
```

En este proyecto se añade además una comprobación de errores:

```ts
if (!response.ok) {
    throw new Error("Error HTTP: " + response.status);
}
```

Y:

```ts
.catch((error) => {
    this.error = "No se han podido cargar las series: " + error.message;
});
```

---

## 6. Si el backend devuelve un ARRAY

La API utilizada por el profesor devuelve directamente:

```json
[
    {...},
    {...},
    {...}
]
```

Por eso podemos recorrer `datos`:

```ts
datos.forEach((element: any) => {
    const serie: ISerie = element as ISerie;
    this.arrSeries.push(serie);
});
```

---

## 7. Si el JSON tiene otra estructura

MUY IMPORTANTE EN EXAMEN.

Puede ocurrir que el servidor devuelva:

```json
{
    "products": [
        {...},
        {...}
    ]
}
```

En ese caso NO puedes hacer:

```ts
datos.forEach(...)
```

Tendrías que acceder al array real:

```ts
datos.products.forEach(...)
```

Primero mira el JSON. Después escribe el código.

---

## 8. Obtener los datos desde un componente

Servicio:

```ts
getAllSeries(): ISerie[] {
    return this.arrSeries;
}
```

Componente:

```ts
private seriesService = inject(SeriesServices);

ngOnInit(): void {
    this.seriesArray = this.seriesService.getAllSeries();
}
```

No se copia el array. Ambos trabajan con la misma referencia.

---

## 9. Mostrar los datos

```html
@for (serie of seriesArray; track serie.id) {
    <app-serie-card [miSerie]="serie"></app-serie-card>
} @empty {
    <p>No hay datos</p>
}
```

---

## 10. Tarjeta hija

```ts
@Input() miSerie: ISerie;
```

Y en HTML:

```html
<h3>{{ miSerie.title }}</h3>
<img [src]="miSerie.image" [alt]="miSerie.title" />
```

---

## 11. Añadir de forma LOCAL

Este patrón NO manda nada al backend:

```ts
addSerie(serie: ISerie): void {
    this.arrSeries.push(serie);
}
```

Al recargar la web o volver a pedir la API, esa serie desaparecerá porque nunca se guardó en el servidor.

---

## 12. Eliminar de forma LOCAL

```ts
const indice = this.arrSeries.findIndex(function (serie) {
    return serie.id === id;
});

if (indice !== -1) {
    this.arrSeries.splice(indice, 1);
}
```

Tampoco hace una petición DELETE.

---

# PROCEDIMIENTO SI EL PROFESOR DA UN BACKEND EN EL EXAMEN

## A. Arrancar backend

Antes de tocar Angular, consigue que el backend funcione.

Comprueba:

```text
¿Arranca sin errores?
¿En qué puerto?
¿Qué endpoints tiene?
¿Qué método HTTP usa cada endpoint?
¿Qué JSON devuelve?
```

## B. Probar endpoint SIN Angular

Ejemplo:

```text
http://localhost:8080/api/carrito
```

Si no funciona en navegador/Postman, Angular tampoco lo arreglará.

## C. Crear interfaz según JSON

Nunca al revés.

```text
JSON DEL BACKEND
       ↓
INTERFAZ ANGULAR
       ↓
SERVICIO
       ↓
COMPONENTE
       ↓
HTML
```

## D. Cambiar URL

```ts
private url: string = "http://localhost:8080/api/...";
```

## E. Hacer fetch

```ts
fetch(this.url)
    .then((response) => response.json())
    .then((datos) => {
        console.log(datos);
    });
```

PRIMERO usa `console.log(datos)` si no tienes claro qué estructura llega.

---

# ERRORES TÍPICOS

## Failed to fetch

Posibles causas:

```text
backend apagado
URL incorrecta
puerto incorrecto
problema de CORS
servidor inaccesible
```

## 404

La petición llega al servidor pero esa ruta no existe.

Revisa:

```text
/api/series
/api/serie
/api/carrito
```

Una sola letra cambia el endpoint.

## CORS

El backend funciona en Postman pero el navegador bloquea Angular.

En el `BackCarrito` del profesor existe una configuración CORS para `/api/**`. Si el backend del examen no la tiene correctamente configurada, puede aparecer un error CORS.

## `datos.forEach is not a function`

Probablemente `datos` NO es un array.

Mira:

```ts
console.log(datos);
```

Tal vez sea:

```json
{
    "products": [...]
}
```

Entonces el array es `datos.products`.

## La pantalla aparece vacía durante un instante

`fetch` es asíncrono. La aplicación se crea antes de que llegue la respuesta.

Por eso el array comienza vacío y después se llena.

## Recargo desde API y desaparecen mis elementos nuevos

Correcto en este modelo.

Los nuevos elementos solo se añadieron al array de Angular. No se enviaron al servidor.

---

# QUÉ NO SE HA METIDO A PROPÓSITO

No se utilizan:

```text
HttpClient
Observables
subscribe()
RxJS para peticiones
```

porque el ejemplo práctico del profesor utiliza directamente `fetch()`.

Tampoco se implementan peticiones POST, PUT o DELETE reales porque el proyecto `SeriesFetchApp` proporcionado por el profesor no las implementa. En este modelo no vamos a inventar una arquitectura distinta a la trabajada en clase.

---

# ARCHIVOS QUE DEBES MIRAR EN EXAMEN

```text
src/app/interfaces/iserie.interface.ts
    → forma de los datos

src/app/services/series-services.ts
    → fetch + array + alta/baja local

src/app/components/serie-list/
    → obtener y recorrer datos

src/app/components/serie-card/
    → Input + visualizar objeto

src/app/components/serie-form/
    → Reactive Form + insertar localmente
```

---

# PRUEBAS RÁPIDAS ANTES DE ENTREGAR

1. La aplicación arranca sin errores.
2. Aparecen datos recibidos de la API.
3. Las imágenes y textos se renderizan.
4. El botón recargar vuelve a pedir los datos.
5. No aparecen duplicados tras recargar.
6. El formulario no permite enviar campos obligatorios vacíos.
7. Rating menor de 0 no es válido.
8. Rating mayor de 10 no es válido.
9. Una nueva serie aparece en el listado.
10. Un título duplicado no se inserta.
11. Eliminar quita la serie del array.
12. Eliminar todas muestra el bloque vacío.
13. Si se rompe temporalmente la URL se muestra un error.
14. Restaurar la URL y pulsar recargar vuelve a cargar datos.
15. No hay errores rojos en la consola del navegador.
