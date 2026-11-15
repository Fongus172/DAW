# REGISTRO USUARIOS TEMPLATE - MODELO DE EXAMEN DWEC

Este proyecto está pensado como referencia rápida para un examen de Angular.
Su objetivo principal es enseñar **formularios Template Driven** usando exactamente los patrones trabajados en clase.

## 1. QUÉ CONCEPTOS CUBRE

- `FormsModule`
- `NgForm`
- `#formulario="ngForm"`
- `(ngSubmit)`
- `name="..."`
- `ngModel`
- referencias como `#nombre="ngModel"`
- `required`
- `minlength` / `maxlength`
- `min` / `max`
- `pattern`
- validación de email
- `valid` / `invalid`
- `touched`
- mensajes de error en HTML
- `markAllAsTouched()`
- `resetForm()`
- validaciones adicionales en TypeScript
- control de cadenas vacías y espacios
- control de `null` / `undefined`
- control de `NaN`
- usuarios duplicados con `some()`
- búsqueda con `find()`
- arrays con `push()`, `pop()` y `splice()`
- `@if`
- `@for` y `@empty`
- Property Binding como `[disabled]` y `[class...]`

---

## 2. RECETA DEL PROFESOR PARA TEMPLATE FORMS

### Paso 1 - Importar FormsModule

```ts
import { FormsModule, NgForm } from '@angular/forms';

@Component({
    imports: [FormsModule]
})
```

### Paso 2 - Crear el formulario

```html
<form>
</form>
```

### Paso 3 - Dar nombre Angular al formulario

```html
<form #miFormulario="ngForm">
```

### Paso 4 - Crear el ngSubmit

```html
<form #miFormulario="ngForm" (ngSubmit)="guardar(miFormulario)">
```

### Paso 5 - Todos los campos llevan name y ngModel

```html
<input
    type="text"
    name="nombre"
    ngModel
/>
```

### Paso 6 - Recoger el formulario en TypeScript

```ts
guardar(miFormulario: NgForm): void {
    console.log(miFormulario.value);
}
```

---

## 3. VALIDACIÓN DE UN CAMPO

```html
<input
    type="text"
    name="nombre"
    ngModel
    #nombre="ngModel"
    required
    minlength="2"
/>

@if (nombre.invalid && nombre.touched) {
    <p>El nombre no es válido</p>
}
```

La referencia:

```html
#nombre="ngModel"
```

permite consultar el estado del campo.

---

## 4. ERRORES CONCRETOS

```html
@if (nombre.errors?.['required']) {
    <p>Campo obligatorio</p>
}

@if (nombre.errors?.['minlength']) {
    <p>Demasiado corto</p>
}
```

---

## 5. IMPEDIR QUE LOS ESPACIOS CUENTEN COMO TEXTO

`required` puede considerar que `"     "` tiene contenido.
Por eso, en TypeScript conviene hacer:

```ts
const nombre = String(form.value.nombre ?? '').trim();

if (nombre === '') {
    return;
}
```

`?? ''` también protege frente a `null` o `undefined`.

---

## 6. NÚMEROS

```ts
const edad = Number(form.value.edad);

if (!Number.isInteger(edad) || edad < 18 || edad > 120) {
    return;
}
```

Esto cubre:

- `NaN`
- decimales
- negativos
- números demasiado grandes

---

## 7. EVITAR DUPLICADOS

```ts
const repetido = this.usuarios.some(function (item) {
    return item.email === email;
});

if (repetido) {
    return;
}
```

---

## 8. BUSCAR UN ELEMENTO

```ts
const encontrado = this.usuarios.find(function (item) {
    return item.usuario === usuario;
});

if (encontrado === undefined) {
    // No existe.
}
```

---

## 9. LIMPIAR FORMULARIO

```ts
miFormulario.resetForm();
```

Es mejor que vaciar cada campo manualmente porque también reinicia estados como `touched`.

---

## 10. ARCHIVOS IMPORTANTES

```text
src/app/components/registro-usuarios/
    registro-usuarios.component.ts
    registro-usuarios.component.html
    registro-usuarios.component.css

src/app/interfaces/
    Iusuario.interface.ts
```

---

## 11. COMANDOS PARA RECREAR EL PROYECTO

```bash
ng new RegistroUsuariosTemplate --skip-tests
cd RegistroUsuariosTemplate
npm install bootstrap
ng g c components/registro-usuarios --type=component --skip-tests
ng g i interfaces/Iusuario --type=interface
ng s -o
```

En `angular.json`, siguiendo los ejemplos del profesor:

```json
"styles": [
    "src/styles.css",
    "node_modules/bootstrap/dist/css/bootstrap.min.css"
],
"scripts": [
    "node_modules/bootstrap/dist/js/bootstrap.min.js"
]
```

---

## 12. CASOS QUE DEBES PROBAR EN EXAMEN

1. Enviar formulario completamente vacío.
2. Escribir solo espacios.
3. Email incorrecto.
4. DNI incorrecto.
5. Teléfono con menos/más de 9 números.
6. Edad negativa.
7. Edad 0.
8. Edad superior al máximo.
9. Edad decimal.
10. Contraseñas diferentes.
11. Condiciones sin aceptar.
12. Usuario/email/DNI duplicado.
13. Login correcto.
14. Login con contraseña incorrecta.
15. Login con usuario inexistente.

Si todas estas pruebas funcionan, el formulario está bastante blindado.
