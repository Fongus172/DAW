# CHULETA DE EXAMEN - SERVICIOS E INYECCIÓN DE DEPENDENCIAS

## 1. Qué problema resuelve este proyecto

Tenemos varios componentes que necesitan trabajar con los mismos datos:

```text
TareaForm  ───┐
              │
TareaList  ───┼──> TareaService ───> array de tareas
              │
TareaCard  ───┤
              │
TareaStats ───┘
```

No necesitamos pasar todos los datos continuamente entre padre e hijo. Los componentes piden el mismo servicio y el servicio centraliza los datos y las operaciones.

Este patrón sigue los ejemplos recientes del profesor: decorador `@Service()`, `inject()` y `ChangeDetectionStrategy.Eager` en los componentes que muestran arrays compartidos.

---

## 2. Crear un servicio

Comando habitual:

```bash
ng g s services/tarea --skip-tests
```

En Angular 22, siguiendo el ejemplo del profesor:

```ts
import { Service } from "@angular/core";

@Service()
export class TareaService {
}
```

---

## 3. Datos privados dentro del servicio

```ts
private tareas: ITarea[];

constructor() {
    this.tareas = [];
}
```

`private` significa que un componente no debería hacer directamente:

```ts
this.tareaService.tareas
```

Creamos métodos para acceder a los datos:

```ts
getAllTareas(): ITarea[] {
    return this.tareas;
}
```

---

## 4. Inyectar el servicio en un componente

Patrón usado por el profesor:

```ts
import { Component, inject } from "@angular/core";
import { TareaService } from "../../services/tarea.service";

private tareaService = inject(TareaService);
```

Ahora podemos llamar a sus métodos:

```ts
this.tareaService.addTarea(nuevaTarea);
```

---

## 5. Añadir datos desde un componente

El formulario NO hace esto:

```ts
this.tareas.push(tarea);
```

porque el array pertenece al servicio.

Hace esto:

```ts
this.tareaService.addTarea(tarea);
```

Y el servicio contiene:

```ts
addTarea(tarea: ITarea): void {
    this.tareas.push(tarea);
}
```

---

## 6. Leer los mismos datos desde otro componente

```ts
tareas: ITarea[];
private tareaService = inject(TareaService);

constructor() {
    this.tareas = [];
}

ngOnInit(): void {
    this.tareas = this.tareaService.getAllTareas();
}
```

La idea importante es que el formulario y el listado trabajan con EL MISMO servicio.

---

## 7. Eager en listados compartidos

En los ejemplos recientes del profesor aparece:

```ts
changeDetection: ChangeDetectionStrategy.Eager
```

Ejemplo:

```ts
import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    ...
    changeDetection: ChangeDetectionStrategy.Eager,
})
```

En este proyecto se usa en el listado y en las estadísticas porque otros componentes modifican los datos compartidos.

---

## 8. Buscar un elemento

```ts
const tarea = this.tareas.find(function (tarea) {
    return tarea.id === id;
});
```

`find()` devuelve el elemento o `undefined`.

Siempre conviene comprobar:

```ts
if (tarea === undefined) {
    return;
}
```

---

## 9. Eliminar por ID

```ts
const indice = this.tareas.findIndex(function (tarea) {
    return tarea.id === id;
});

if (indice !== -1) {
    this.tareas.splice(indice, 1);
}
```

- `findIndex()` localiza la posición.
- `-1` significa que no se encontró.
- `splice(indice, 1)` elimina un elemento.

---

## 10. Modificar un objeto

```ts
const tarea = this.getTareaById(id);

if (tarea === undefined) {
    return;
}

tarea.completada = !tarea.completada;
```

El objeto está dentro del array compartido, por lo que el cambio se refleja para todos los componentes que trabajan con ese objeto.

---

## 11. Servicio frente a Input/Output

### Input/Output

Útil cuando hay una relación directa padre-hijo:

```text
Padre -> hijo
Hijo -> padre
```

### Servicio

Muy útil cuando varios componentes necesitan los mismos datos:

```text
Formulario ─┐
Listado ────┼── Servicio
Estadísticas┘
```

No son técnicas enemigas. En aplicaciones reales pueden aparecer juntas.

En este proyecto `TareaList` pasa una tarea a `TareaCard` mediante `@Input`, pero `TareaCard` usa el servicio para cambiar o eliminar la tarea.

---

## 12. Flujo completo de este proyecto

### Añadir

```text
Usuario rellena TareaForm
        ↓
getDataForm()
        ↓
TareaService.addTarea()
        ↓
push() en el array compartido
        ↓
TareaList y TareaStats muestran el nuevo estado
```

### Completar

```text
Botón de TareaCard
        ↓
cambiarEstado()
        ↓
TareaService.cambiarEstado(id)
        ↓
find()
        ↓
completada = !completada
```

### Eliminar

```text
Botón de TareaCard
        ↓
TareaService.deleteTarea(id)
        ↓
findIndex()
        ↓
splice()
```

---

## 13. Archivos a mirar durante el examen

### Necesito recordar cómo crear/injectar un servicio

`src/app/services/tarea.service.ts`

### Necesito añadir desde un formulario a un servicio

`src/app/components/tarea-form/tarea-form.component.ts`

### Necesito obtener un array compartido

`src/app/components/tarea-list/tarea-list.component.ts`

### Necesito que un componente hijo modifique datos mediante un servicio

`src/app/components/tarea-card/tarea-card.component.ts`

### Necesito varios componentes leyendo el mismo servicio

`src/app/components/tarea-stats/tarea-stats.component.ts`

---

## 14. Pruebas que debe superar

1. Al iniciar aparecen tres tareas.
2. Las estadísticas muestran 3 tareas.
3. Crear una tarea válida la añade al listado.
4. Tras añadirla aumenta el total.
5. Un título vacío no se acepta.
6. Un título de menos de tres caracteres muestra error.
7. Un título formado solo por espacios no se acepta.
8. Completar una tarea cambia su estado.
9. Las estadísticas cambian al completar una tarea.
10. Volver a pulsar permite marcarla pendiente.
11. Eliminar borra únicamente la tarea seleccionada.
12. Eliminar completadas elimina todas las completadas.
13. El listado muestra el bloque vacío cuando no quedan tareas.
14. Los componentes siguen mostrando los mismos datos después de varias operaciones.

---

## 15. Qué NO incluye a propósito

Este proyecto no usa backend ni `fetch`.

Eso se estudiará en `CatalogoSeriesBackend`.

Tampoco convierte el servicio en una arquitectura complicada con RxJS, Observables o Subjects, porque esos elementos no aparecen en los ejercicios que estamos tomando como referencia.
