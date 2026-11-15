# FESTIVAL SERIES ANGULAR - GUÍA DE EXAMEN

Este proyecto está pensado como simulacro grande. No hay que memorizarlo entero: hay que saber localizar el patrón que necesites y adaptarlo.

## 1. Qué practica

- Componentes standalone.
- Interfaces TypeScript.
- Interpolación y Property Binding.
- Event Binding y `$event`.
- `@if`, `@else`, `@for`, `@empty`, `@switch`.
- Comunicación padre-hijo con Input y Output.
- EventEmitter.
- Template Driven Forms con `FormsModule`, `NgForm`, `ngModel`, `name` y `ngSubmit`.
- Reactive Forms con `ReactiveFormsModule`, `FormGroup`, `FormControl` y `Validators`.
- Validador personalizado de contraseñas.
- Servicios e inyección con `@Service()` e `inject()`.
- `ChangeDetectionStrategy.Eager` en listados/resúmenes que dependen de arrays compartidos.
- `fetch()` a la API utilizada en el proyecto del profesor.
- `find`, `findIndex`, `push`, `splice`, `forEach`.
- Alta, modificación de cantidades y eliminación de reservas.
- Bootstrap.

## 2. Arquitectura

```text
API DE SERIES
     |
   fetch
     |
SeriesService
     |
SerieList
     |
SerieCard
     |
Output con la serie seleccionada
     |
App
     |
Input
     |
ReservaForm ---> ReservaService <--- ReservaList
                         |
                      Resumen

UsuarioReactive ---> UsuarioService ---> Resumen
```

## 3. Dónde mirar según lo que pida el examen

### Backend / fetch

`src/app/services/series.service.ts`

Patrón:

```ts
fetch(this.url)
    .then((response) => response.json())
    .then((datos) => {
        datos.forEach((element: any) => {
            const elemento = element as MiInterfaz;
            this.array.push(elemento);
        });
    });
```

Antes de programar Angular, comprueba siempre la respuesta real del backend.

### Input y Output

`serie-card.ts`, `serie-list.ts` y `app.ts`.

Hijo recibe:

```ts
@Input() serie: ISerie;
```

Hijo emite:

```ts
@Output() reservar: EventEmitter<ISerie> = new EventEmitter();
this.reservar.emit(this.serie);
```

Padre escucha:

```html
<app-serie-card (reservar)="reservarSerie($event)"></app-serie-card>
```

### Template Form

`reserva-form.ts` y `reserva-form.html`.

Receta:

```ts
imports: [FormsModule]
```

```html
<form #miFormulario="ngForm" (ngSubmit)="getDataForm(miFormulario)">
    <input name="nombre" ngModel required />
</form>
```

```ts
getDataForm(miFormulario: NgForm): void {
    const datos = miFormulario.value;
}
```

### Reactive Form

`usuario-reactive.ts` y `usuario-reactive.html`.

Receta:

```ts
imports: [ReactiveFormsModule]
```

```ts
modelForm: FormGroup;

this.modelForm = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
});
```

```html
<form [formGroup]="modelForm" (ngSubmit)="getDataForm()">
    <input formControlName="nombre" />
</form>
```

### Servicio compartido

`reserva.service.ts`.

Regla mental:

- El servicio guarda los datos.
- Los componentes llaman a métodos del servicio.
- No copies el mismo array en cada componente.

### CRUD / arrays

Alta:

```ts
this.reservas.push(reserva);
```

Buscar:

```ts
const reserva = this.reservas.find(...);
```

Buscar posición:

```ts
const indice = this.reservas.findIndex(...);
```

Eliminar:

```ts
this.reservas.splice(indice, 1);
```

Recorrer:

```ts
this.reservas.forEach(...);
```

## 4. Validaciones que debes recordar

No basta con `required` si el profesor pide casos extremos.

Para texto:

```ts
const texto = String(valor ?? "").trim();
if (texto === "") {
    return;
}
```

Para números enteros:

```ts
const numero = Number(valor);
if (!Number.isInteger(numero)) {
    return;
}
```

Para límites:

```ts
if (numero < 1 || numero > 10) {
    return;
}
```

Para formulario inválido:

```ts
if (this.modelForm.invalid) {
    this.modelForm.markAllAsTouched();
    return;
}
```

## 5. Si el profesor entrega un backend

Orden recomendado:

1. Arranca el backend.
2. Busca el puerto.
3. Busca el endpoint.
4. Ábrelo en navegador/Postman.
5. Mira el JSON exacto.
6. Crea la interfaz a partir de ese JSON.
7. Crea servicio.
8. Pon la URL.
9. Haz `fetch`.
10. Haz `console.log(datos)` si no entiendes la estructura.
11. Pinta los datos con `@for`.

Errores típicos:

- `Failed to fetch`: backend apagado, URL, puerto o CORS.
- 404: endpoint incorrecto.
- `datos.forEach is not a function`: la respuesta no es directamente un array.
- pantalla vacía durante un instante: `fetch` es asíncrono.

## 6. Qué NO hace este proyecto

El proyecto NO envía POST/PUT/DELETE reales a la API porque el ejemplo `SeriesFetchApp` del profesor solo ha trabajado el GET remoto. Las altas y bajas del resto de datos son locales, siguiendo su estilo.

No se han añadido HttpClient, RxJS, routing funcional, guards ni otras herramientas no trabajadas en los ejemplos suministrados.

## 7. Pruebas antes de entregar

1. La aplicación arranca sin errores.
2. La API carga series.
3. Recargar API no duplica datos.
4. Una tarjeta puede seleccionar una serie.
5. El nombre vacío no se acepta.
6. Un nombre con solo espacios no se acepta.
7. Email incorrecto no se acepta.
8. Entradas 0 no se aceptan.
9. Entradas negativas no se aceptan.
10. Entradas decimales no se aceptan.
11. Más de 10 entradas no se aceptan.
12. La reserva aparece en la tabla.
13. El botón + funciona hasta 10.
14. El botón - elimina al llegar a 0.
15. Eliminar reserva funciona.
16. `@empty` se muestra cuando no hay reservas.
17. Reactive Form detecta nombre corto.
18. Reactive Form detecta email incorrecto.
19. Reactive Form detecta edad fuera de 18-120.
20. Reactive Form detecta DNI con formato incorrecto.
21. Contraseñas distintas muestran error.
22. Email de usuario duplicado no se acepta.
23. El resumen cambia al añadir/eliminar datos.
24. No hay errores en consola.
25. Git status está limpio antes de entregar.

## 8. Comandos de inicio

```bat
ng new FestivalSeriesAngular --skip-tests
cd FestivalSeriesAngular
npm install bootstrap
ng s -o
```

Componente:

```bat
ng g c components/nombre --type=component --skip-tests
```

Interfaz:

```bat
ng g i interfaces/Inombre --type=interface
```

Servicio:

```bat
ng g s services/nombre --skip-tests
```

## 9. Git

```bat
git status
git add .
git commit -m "Proyecto examen Angular"
git push origin main
```
