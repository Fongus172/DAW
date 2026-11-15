# MuseoDataBinding - Proyecto de repaso para examen DWEC

Este proyecto está construido siguiendo los ejemplos del profesor de:

- `EjemploDataBinding`
- `EjemploTwoWayDatabinding`
- `EjemploControlFlow`
- Tema 5: Data Binding y eventos
- Tema 6: Control Flow y Signals

La idea no es hacer una aplicación compleja, sino tener **ejemplos funcionales, separados y fáciles de copiar/adaptar durante el examen**.

---

## 1. Qué repasa cada componente

### `binding-component`

Referencia para:

- Interpolación: `{{ propiedad }}`
- Métodos desde interpolación: `{{ metodo() }}`
- Property Binding: `[src]`, `[href]`, `[disabled]`
- `[innerHTML]`
- Class Binding: `[class.destacada]`
- Event Binding: `(click)`, `(blur)`, `(input)`
- `$event`
- Two Way Binding: `[(ngModel)]`
- `FormsModule`

### `if-component`

Referencia para:

- `@if`
- `@else if`
- `@else`
- Recoger datos desde `$event.target.value`
- Comprobar valores vacíos y edades fuera de rango

### `for-component`

Referencia para:

- Interfaces
- Arrays de objetos
- `push()`
- `pop()`
- `@for`
- `track objeto.id`
- `$index`
- `$even`
- `$first`
- `$last`
- `@empty`

### `switch-component`

Referencia para:

- `@switch`
- `@case`
- `@default`
- Cambiar una propiedad mediante eventos `(click)`

### `signal-component`

Referencia para:

- `signal()`
- Leer un signal: `signal()`
- Cambiar un signal: `.set()`

---

## 2. Comandos para crear el proyecto desde cero

```bash
ng new MuseoDataBinding --skip-tests
cd MuseoDataBinding
code .
npm install bootstrap
```

En `angular.json`:

```json
"styles": [
    "src/styles.css",
    "node_modules/bootstrap/dist/css/bootstrap.min.css"
],
"scripts": [
    "node_modules/bootstrap/dist/js/bootstrap.min.js"
]
```

Crear los componentes:

```bash
ng g c components/binding-component --skip-tests
ng g c components/if-component --skip-tests
ng g c components/for-component --skip-tests
ng g c components/switch-component --skip-tests
ng g c components/signal-component --skip-tests
```

Crear la interfaz:

```bash
ng g i interfaces/IObra --type=interface
```

Arrancar:

```bash
ng s -o
```

---

## 3. Chuleta rápida de sintaxis

### Interpolación

```html
<p>{{ nombre }}</p>
```

### Property Binding

```html
<img [src]="imagen">
<button [disabled]="bloqueado">Guardar</button>
```

### Event Binding

```html
<button (click)="guardar()">Guardar</button>
<input (blur)="validar()">
```

### Two Way Binding

Importar primero:

```ts
import { FormsModule } from "@angular/forms";
```

En `@Component`:

```ts
imports: [FormsModule]
```

HTML:

```html
<input [(ngModel)]="nombre">
```

### @if

```html
@if (edad >= 18) {
    <p>Mayor de edad</p>
} @else {
    <p>Menor de edad</p>
}
```

### @for

```html
@for (elemento of elementos; track elemento.id) {
    <p>{{ elemento.nombre }}</p>
} @empty {
    <p>No hay datos</p>
}
```

### @switch

```html
@switch (rol) {
    @case ("admin") {
        <p>Administrador</p>
    }
    @default {
        <p>Sin permisos</p>
    }
}
```

### Signal

```ts
contador = signal(0);

sumar() {
    this.contador.set(this.contador() + 1);
}
```

```html
<p>{{ contador() }}</p>
```

---

## 4. Qué NO pretende cubrir este proyecto

No usamos aquí formularios Template completos, Reactive Forms, servicios, `@Input/@Output`, CRUD completo ni `fetch`.

Esos conceptos estarán en proyectos posteriores para que este proyecto siga siendo fácil de consultar.
