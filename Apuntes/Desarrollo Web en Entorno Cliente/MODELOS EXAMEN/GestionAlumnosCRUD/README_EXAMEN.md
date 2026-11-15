# GUÍA DE EXAMEN - GESTIÓN DE ALUMNOS CRUD

## 1. Para qué sirve este proyecto

Este proyecto es una plantilla para ejercicios en los que haya que gestionar una colección de objetos en memoria.

La temática es alumnos, pero el mismo patrón sirve para productos, libros, películas, clientes, coches, noticias, reservas, etc.

CRUD significa:

- Create: crear.
- Read: listar/leer.
- Update: editar.
- Delete: eliminar.

## 2. Estructura importante

```text
src/app/
├── interfaces/
│   └── ialumno.interface.ts
└── components/
    └── alumnos-crud/
        ├── alumnos-crud.component.ts
        ├── alumnos-crud.component.html
        └── alumnos-crud.component.css
```

## 3. Interfaz

```ts
export interface IAlumno {
    id: number;
    nombre: string;
    apellidos: string;
    edad: number;
    curso: string;
    email: string;
    nota: number;
}
```

Si el examen cambia de temática, normalmente cambiaremos esta interfaz y los campos del formulario.

## 4. Array inicial

```ts
alumnos: IAlumno[];
```

En el constructor se puede cargar con varios objetos para tener datos iniciales.

## 5. Alta con push()

```ts
const nuevoAlumno: IAlumno = {
    id: this.siguienteId,
    nombre: this.nombre.trim(),
    // ...
};

this.alumnos.push(nuevoAlumno);
```

`push()` añade al final del array.

## 6. Buscar un elemento con find()

Ejemplo para comprobar emails duplicados:

```ts
const encontrado = this.alumnos.find((alumno) => {
    return alumno.email === this.email;
});
```

- Si encuentra algo, devuelve el objeto.
- Si no encuentra nada, devuelve `undefined`.

## 7. Buscar la posición con findIndex()

```ts
const posicion = this.alumnos.findIndex((alumno) => alumno.id === id);
```

- Devuelve 0, 1, 2... si lo encuentra.
- Devuelve -1 si no existe.

Esto es útil para editar o eliminar.

## 8. Eliminar con splice()

```ts
this.alumnos.splice(posicion, 1);
```

Significa: desde `posicion`, elimina 1 elemento.

## 9. Buscar/filtrar con filter()

```ts
this.alumnosFiltrados = this.alumnos.filter((alumno) => {
    return alumno.nombre.toLowerCase().includes(texto);
});
```

`filter()` devuelve un array nuevo solamente con los elementos que cumplen la condición.

## 10. Modificar todos con map()

```ts
this.alumnos = this.alumnos.map((alumno) => {
    return {
        id: alumno.id,
        nombre: alumno.nombre,
        apellidos: alumno.apellidos,
        edad: alumno.edad,
        curso: alumno.curso,
        email: alumno.email,
        nota: alumno.nota + 0.5,
    };
});
```

`map()` devuelve un array nuevo transformando cada elemento.

## 11. Recorrer con forEach()

```ts
let suma = 0;

this.alumnos.forEach((alumno) => {
    suma += alumno.nota;
});
```

Sirve cuando necesitamos recorrer todos los elementos sin crear otro array.

## 12. Listar en HTML

```html
@for (alumno of alumnosFiltrados; track alumno.id) {
    <p>{{ alumno.nombre }}</p>
} @empty {
    <p>No hay alumnos.</p>
}
```

Conviene usar un id único en `track` cuando exista.

## 13. Patrón de alta y edición con el mismo formulario

Utilizamos:

```ts
idEdicion: number;
```

Valor inicial:

```ts
this.idEdicion = -1;
```

Entonces:

```ts
if (this.idEdicion === -1) {
    // Crear
} else {
    // Editar
}
```

Al pulsar Editar copiamos los datos del objeto en las propiedades del formulario.

```ts
editarAlumno(alumno: IAlumno): void {
    this.idEdicion = alumno.id;
    this.nombre = alumno.nombre;
    // ...
}
```

Gracias a `[(ngModel)]`, los inputs cambian automáticamente.

## 14. Validaciones importantes

Texto vacío o solamente espacios:

```ts
if (this.nombre.trim() === "") {
    return;
}
```

Número vacío:

```ts
if (this.edad === null) {
    return;
}
```

Número entero:

```ts
if (!Number.isInteger(this.edad)) {
    return;
}
```

Rango:

```ts
if (this.edad < 16 || this.edad > 99) {
    return;
}
```

Duplicado:

```ts
const repetido = this.alumnos.find((alumno) => alumno.email === this.email);
```

## 15. Pruebas que conviene hacer antes de entregar

1. Añadir un alumno correcto.
2. Intentar guardar todos los campos vacíos.
3. Escribir solamente espacios en nombre/apellidos.
4. Dejar edad vacía.
5. Introducir edad decimal.
6. Introducir edad fuera del rango.
7. Introducir nota negativa.
8. Introducir nota mayor que 10.
9. Introducir correo incorrecto.
10. Repetir un correo existente.
11. Editar un alumno.
12. Cancelar una edición.
13. Eliminar un alumno.
14. Buscar por nombre.
15. Buscar por curso.
16. Buscar algo inexistente y comprobar `@empty`.
17. Eliminar todos los alumnos.
18. Comprobar que la media no falla con el array vacío.

## 16. Comandos

```bash
ng new GestionAlumnosCRUD --skip-tests
cd GestionAlumnosCRUD
npm install bootstrap
ng g c components/alumnos-crud --type=component --skip-tests
ng g i interfaces/Ialumno --type=interface
ng s -o
```

Bootstrap en `angular.json` siguiendo los apuntes de clase:

```json
"styles": [
    "src/styles.css",
    "node_modules/bootstrap/dist/css/bootstrap.min.css"
],
"scripts": [
    "node_modules/bootstrap/dist/js/bootstrap.min.js"
]
```

## 17. Qué NO estamos practicando aquí

Este proyecto NO usa servicios, backend, fetch, Input/Output ni Reactive Forms.

Es intencionado: este modelo está pensado para dominar CRUD y manipulación de arrays sin mezclar más conceptos.
