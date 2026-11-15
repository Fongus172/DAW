# BIBLIOTECA COMPONENTES - GUÍA DE EXAMEN

Este proyecto está pensado como modelo de consulta para **comunicación entre componentes padre e hijo**.

## 1. Idea fundamental

### Padre -> hijo: @Input()

El padre posee un dato:

```ts
libros: ILibro[];
```

El hijo prepara una propiedad para recibirlo:

```ts
@Input() libro: ILibro;
```

El padre lo envía desde el HTML:

```html
<app-libro-card [libro]="libro"></app-libro-card>
```

Los corchetes indican Property Binding.

---

## 2. Hijo -> padre: @Output() + EventEmitter

El hijo crea el evento:

```ts
@Output() eliminarLibro: EventEmitter<number> = new EventEmitter();
```

Cuando ocurre algo en el hijo:

```ts
eliminar(): void {
    this.eliminarLibro.emit(this.libro.id);
}
```

El padre escucha el evento:

```html
<app-libro-card
    (eliminarLibro)="eliminarLibro($event)"
></app-libro-card>
```

Y recibe el valor emitido:

```ts
eliminarLibro($event: number): void {
    console.log($event);
}
```

### Regla mental

```text
@Input  = entra información al hijo
@Output = sale información del hijo
```

---

## 3. Importaciones necesarias en el hijo

```ts
import { Component, EventEmitter, Input, Output } from "@angular/core";
```

Si enviamos objetos, también importamos su interfaz:

```ts
import { ILibro } from "../../interfaces/ilibro.interface";
```

---

## 4. Inicializar los Inputs

Siguiendo el estilo usado en clase, las propiedades se inicializan en el constructor:

```ts
@Input() libro: ILibro;

constructor() {
    this.libro = {
        id: -1,
        titulo: "Libro no definido",
        autor: "Autor no definido",
        genero: "Sin género",
        paginas: 0,
        disponible: false,
    };
}
```

Angular sustituirá después ese valor cuando el padre envíe el objeto real.

---

## 5. EventEmitter con y sin información

### Enviando un number

```ts
@Output() seleccionarLibro: EventEmitter<number> = new EventEmitter();

this.seleccionarLibro.emit(this.libro.id);
```

### Sin enviar datos

```ts
@Output() cerrarDetalle: EventEmitter<void> = new EventEmitter();

this.cerrarDetalle.emit();
```

---

## 6. Patrón habitual con @for

El padre tiene un array y genera un hijo por cada elemento:

```html
@for (libro of libros; track libro.id; let indice = $index) {
    <app-libro-card
        [libro]="libro"
        [posicion]="indice"
        (eliminarLibro)="eliminarLibro($event)"
    ></app-libro-card>
}
```

Es un patrón reutilizable para:

- productos -> ProductCard
- alumnos -> AlumnoCard
- películas -> PeliculaCard
- noticias -> NoticiaCard
- usuarios -> UsuarioCard

---

## 7. Qué componente debe modificar los datos

En este ejemplo, el hijo NO elimina directamente del array.

El hijo solamente avisa:

```ts
this.eliminarLibro.emit(this.libro.id);
```

El padre recibe el id y modifica su propio array:

```ts
const indice = this.libros.findIndex(function (libro) {
    return libro.id === $event;
});

this.libros.splice(indice, 1);
```

Esto ayuda a mantener clara la responsabilidad de cada componente.

---

## 8. Componentes del ejemplo

### App

Es el PADRE.

- Tiene `libros`.
- Carga las tarjetas.
- Envía libros por Input.
- Recibe Outputs.
- Modifica el array.
- Controla qué libro está seleccionado.

### LibroCardComponent

Es un HIJO.

Recibe:

```ts
@Input() libro
@Input() posicion
```

Emite:

```ts
@Output() seleccionarLibro
@Output() cambiarDisponibilidad
@Output() eliminarLibro
```

### LibroDetalleComponent

Es otro HIJO.

Recibe:

```ts
@Input() libro
```

Emite:

```ts
@Output() cerrarDetalle
```

---

## 9. Errores típicos de examen

### Error: el Input no existe en el hijo

Si escribes:

```html
<app-libro-card [libro]="libro">
```

el hijo necesita:

```ts
@Input() libro: ILibro;
```

### Error: nombre distinto entre Output y HTML

Si el hijo tiene:

```ts
@Output() eliminarLibro = new EventEmitter<number>();
```

el padre debe escuchar EXACTAMENTE:

```html
(eliminarLibro)="..."
```

### Error: olvidar $event

Si el hijo hace:

```ts
.emit(5)
```

el padre recupera ese 5 mediante:

```html
(miEvento)="miMetodo($event)"
```

### Error: olvidar importar el hijo en un componente standalone

```ts
imports: [LibroCardComponent]
```

---

## 10. Comandos para recrearlo

```bash
ng new BibliotecaComponentes --skip-tests
cd BibliotecaComponentes
npm install bootstrap
ng g c components/libro-card --type=component --skip-tests
ng g c components/libro-detalle --type=component --skip-tests
ng g i interfaces/ilibro --type=interface
ng s -o
```

Recuerda configurar Bootstrap en `angular.json` con el patrón usado en clase.

---

## 11. Pruebas antes de entregar

1. Se muestran los cuatro libros iniciales.
2. Cada tarjeta recibe correctamente su objeto.
3. La posición cambia en cada tarjeta.
4. "Ver detalle" muestra el libro correcto.
5. "Cerrar detalle" lo oculta.
6. Cambiar estado alterna Disponible/Prestado.
7. Eliminar borra únicamente el libro pulsado.
8. Si borras el libro que estaba abierto, desaparece el detalle.
9. Si eliminas todos, aparece el bloque `@empty`.
10. Restaurar vuelve a cargar los datos iniciales.
11. No hay errores en la consola.

---

## 12. Lo que NO se usa aquí a propósito

Este proyecto no utiliza:

- Servicios
- fetch
- Reactive Forms
- Template Forms completos
- Backend

Esas materias están separadas en otros modelos para que este proyecto sea una referencia limpia de `@Input`, `@Output` y `EventEmitter`.
