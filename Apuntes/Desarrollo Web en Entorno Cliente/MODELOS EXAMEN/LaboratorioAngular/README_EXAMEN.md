# LABORATORIO ANGULAR - GUÍA PARA EL EXAMEN

Este proyecto reúne conceptos que aparecen en la teoría pero que son menos frecuentes que formularios, arrays, servicios o fetch.

## PRIORIDAD

### Prioridad alta dentro de este proyecto

- ngClass.
- ngStyle.
- switch.
- `$event`.
- innerHTML.
- `ngOnInit()`.

### Prioridad media

- `signal()` y `.set()`.
- Input Signals.
- `ngOnDestroy()` y `ngOnChanges()`.

### Prioridad baja

- Directivas personalizadas.
- Resto de hooks de ciclo de vida.

No estudies este proyecto antes que Template Forms, Reactive Forms, servicios, CRUD o fetch.

---

# 1. SIGNALS

Importamos:

```ts
import { signal } from "@angular/core";
```

Creamos:

```ts
contador = signal(0);
```

Leemos:

```ts
this.contador()
```

En HTML:

```html
{{ contador() }}
```

Modificamos:

```ts
this.contador.set(this.contador() + 1);
```

IMPORTANTE: un signal se lee llamándolo como una función.

---

# 2. INPUT SIGNALS

El Tema 6 presenta una alternativa a Input tradicional:

```ts
import { input } from "@angular/core";

titulo = input.required<string>();
nivel = input(0);
```

En el hijo se leen como funciones:

```html
{{ titulo() }}
{{ nivel() }}
```

El padre los envía mediante Property Binding:

```html
<app-input-signal [titulo]="tituloPanel" [nivel]="nivelPanel"></app-input-signal>
```

Para el examen, si el profesor pide expresamente Input/Output tradicional, utiliza `@Input()` y `@Output()` como en BibliotecaComponentes.

---

# 3. ngClass

En un standalone component importamos:

```ts
import { NgClass } from "@angular/common";
```

Y lo añadimos a imports del componente.

Ejemplo mediante objeto:

```html
<p [ngClass]="{ activo: activo, inactivo: !activo }">
```

Si `activo` es true se añade la clase `activo`.

---

# 4. ngStyle

Importamos `NgStyle` desde `@angular/common`.

Ejemplo:

```html
<p [ngStyle]="{ 'font-size.px': tamanoTexto }">
```

El valor de la propiedad de TypeScript decide el tamaño.

---

# 5. EVENT Y $event

HTML:

```html
<input (input)="capturarTexto($event)" />
```

TypeScript:

```ts
capturarTexto($event: Event): void {
    const input = $event.target as HTMLInputElement;
    this.texto = input.value;
}
```

`target` representa el elemento HTML que ha lanzado el evento.

---

# 6. innerHTML

Si tenemos:

```ts
contenido = "<strong>Hola</strong>";
```

Una interpolación mostraría las etiquetas como texto.

Usamos:

```html
<div [innerHTML]="contenido"></div>
```

---

# 7. SWITCH

```html
@switch (rol) {
    @case ("admin") {
        <p>Administrador</p>
    }
    @case ("editor") {
        <p>Editor</p>
    }
    @default {
        <p>Sin permisos</p>
    }
}
```

No necesita `break`.

---

# 8. DIRECTIVA PERSONALIZADA

Comando de teoría:

```bash
ng g directive directives/resaltar
```

Ejemplo sencillo:

```ts
import { Directive, ElementRef } from "@angular/core";

@Directive({
    selector: "[resaltar]",
})
export class ResaltarDirective {
    constructor(elemento: ElementRef) {
        elemento.nativeElement.style.backgroundColor = "yellow";
    }
}
```

Uso:

```html
<p resaltar>Texto</p>
```

Esta parte aparece en el Tema 6, pero no es de las que más se repiten en los proyectos prácticos del profesor.

---

# 9. CICLO DE VIDA

Orden aproximado que interesa reconocer:

```text
constructor
ngOnChanges
ngOnInit
ngDoCheck
ngAfterContentInit
ngAfterContentChecked
ngAfterViewInit
ngAfterViewChecked
...
ngOnDestroy
```

## constructor

Inicializa propiedades de la clase.

## ngOnChanges

Se ejecuta cuando cambian propiedades recibidas como Input.

```ts
ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
}
```

## ngOnInit

Es el hook más importante de cara a los ejercicios que ha hecho el profesor.

```ts
export class MiComponente implements OnInit {
    ngOnInit(): void {
        // Buen lugar para pedir datos.
    }
}
```

En PrimeraAppAngular el profesor anota expresamente que es ideal para pedir datos al backend.

## ngDoCheck

Permite intervenir en comprobaciones de cambios. No conviene abusar de él.

## ngAfterContentInit / Checked

Relacionados con la inicialización y comprobación del contenido.

## ngAfterViewInit / Checked

Relacionados con la inicialización y comprobación de la vista.

## ngOnDestroy

Se ejecuta antes de destruir el componente.

En este proyecto puedes probarlo ocultando el componente mediante un bloque condicional y mirando la consola.

---

# 10. QUÉ MIRAR SI TE PIDEN...

```text
Signal                      -> laboratorio.component.ts
Input Signal                -> input-signal.component.ts
ngClass / ngStyle           -> laboratorio.component.html
$event                      -> capturarTexto()
innerHTML                   -> laboratorio.component.html
switch                      -> sección de permisos
Directiva propia            -> resaltar.directive.ts
ngOnInit / lifecycle        -> ciclo-vida.component.ts
ngOnDestroy                 -> ocultar componente de lifecycle
ngOnChanges                 -> cambiar Input del componente de lifecycle
```

---

# 11. ERRORES TÍPICOS

## Escribir un arroba de control flow como texto normal

Angular puede intentar interpretarlo como un bloque.

Si necesitas mostrarlo literalmente dentro de una plantilla usa la entidad HTML correspondiente al arroba:

```html
&#64;if
```

## ngClass o ngStyle no funcionan

Comprueba los imports del standalone component:

```ts
imports: [NgClass, NgStyle]
```

## El Input Signal da error

Si es required:

```ts
titulo = input.required<string>();
```

el padre debe proporcionar siempre `[titulo]`.

## No veo los lifecycle hooks

Abre las herramientas de desarrollo del navegador y mira la consola.

---

# 12. IDEA GENERAL PARA EL EXAMEN

Este proyecto no es para memorizarlo entero.

Sirve como biblioteca de consulta para preguntas menos frecuentes. Si el enunciado no menciona ninguna de estas cosas, no añadas signals, directivas o lifecycle por iniciativa propia. Implementa únicamente lo que el ejercicio necesite.
