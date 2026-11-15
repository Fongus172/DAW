# CHULETA DE EXAMEN - REACTIVE FORMS

Este proyecto está construido siguiendo el patrón del ejemplo `ejemploReactiveForm` del profesor.

## 1. Receta mínima

### Paso 1 - Importar ReactiveFormsModule

En el componente:

```ts
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
    imports: [ReactiveFormsModule]
})
```

### Paso 2 - Crear la propiedad FormGroup

```ts
modelForm: FormGroup;
```

### Paso 3 - Inicializarla en el constructor

```ts
this.modelForm = new FormGroup({
    nombre: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
    ])
});
```

### Paso 4 - Conectar el HTML

```html
<form [formGroup]="modelForm" (ngSubmit)="guardar()">
```

En Reactive Forms el método del submit NO necesita recibir el formulario como parámetro.

### Paso 5 - Conectar cada campo

```html
<input type="text" formControlName="nombre">
```

El nombre debe coincidir exactamente con la clave creada en el `FormGroup`.

---

# VALIDADORES IMPORTANTES

```ts
Validators.required
Validators.minLength(3)
Validators.maxLength(20)
Validators.min(0)
Validators.max(120)
Validators.pattern(/expresion/)
```

Ejemplo:

```ts
edad: new FormControl(null, [
    Validators.required,
    Validators.min(0),
    Validators.max(120)
])
```

---

# MOSTRAR ERRORES

Patrón del profesor:

```ts
checkControl(formControlName: string, validator: string): boolean | undefined {
    return this.modelForm.get(formControlName)?.hasError(validator) &&
        this.modelForm.get(formControlName)?.touched;
}
```

HTML:

```html
@if (checkControl("nombre", "required")) {
    <p class="error">Campo requerido</p>
}
```

---

# ESTADOS QUE DEBES RECORDAR

- `valid`: el control/formulario es válido.
- `invalid`: tiene algún error.
- `pristine`: todavía no se ha modificado.
- `dirty`: el usuario ha cambiado su valor.
- `untouched`: todavía no ha perdido el foco.
- `touched`: el usuario entró en el control y después salió.

Angular añade además clases CSS como:

```text
ng-valid
ng-invalid
ng-pristine
ng-dirty
ng-touched
ng-untouched
```

---

# DESACTIVAR EL ENVÍO SI HAY ERRORES

```html
<button type="submit" [disabled]="modelForm.invalid">
    Guardar
</button>
```

También es recomendable comprobarlo otra vez en TypeScript:

```ts
if (this.modelForm.invalid) {
    this.modelForm.markAllAsTouched();
    return;
}
```

---

# OBTENER LOS DATOS

```ts
const paciente = this.modelForm.value as IPaciente;
```

---

# ALTA / EDICIÓN CON UN MISMO FORMULARIO

Patrón parecido al ejemplo del profesor:

```text
id = -1  -> alta
id != -1 -> edición
```

```ts
if (paciente.id === -1) {
    // crear
} else {
    // actualizar
}
```

---

# CARGAR DATOS PARA EDITAR

Con `setValue()`:

```ts
this.modelForm.setValue({
    id: paciente.id,
    nombre: paciente.nombre,
    ...
});
```

`setValue()` exige dar valor a TODOS los controles del FormGroup.

---

# RESETEAR

```ts
this.modelForm.reset();
this.modelForm.get("id")?.setValue(-1);
```

`reset()` también reinicia estados como `touched` y `dirty`.

---

# VALIDADOR PERSONALIZADO DE UN CONTROL

Un validador recibe un `AbstractControl`.

Debe devolver:

- `null` si todo está correcto.
- un objeto si existe un error.

```ts
miValidador(control: AbstractControl): any {
    if (/* correcto */) {
        return null;
    }

    return { mierror: true };
}
```

Se añade al array de validadores:

```ts
campo: new FormControl(null, [
    Validators.required,
    this.miValidador
])
```

Después:

```html
@if (checkControl("campo", "mierror")) {
    <p>Error personalizado</p>
}
```

---

# VALIDADOR ENTRE VARIOS CAMPOS

Igual que el ejemplo de contraseñas del profesor:

```ts
passValidator(formValue: AbstractControl): any {
    const pass1 = formValue.get("password")?.value;
    const pass2 = formValue.get("repitePassword")?.value;

    return pass1 !== pass2
        ? { passwordnotmatches: true }
        : null;
}
```

Se pone como validador del FormGroup:

```ts
this.modelForm = new FormGroup(
    {
        ...
    },
    [this.passValidator]
);
```

---

# CASOS EXTREMOS PARA PROBAR EN EL EXAMEN

Antes de dar un formulario por terminado prueba:

1. Todos los campos vacíos.
2. Un solo campo vacío.
3. Texto demasiado corto.
4. Número negativo.
5. Número por encima del máximo.
6. Email sin arroba.
7. Email incompleto.
8. DNI con longitud incorrecta.
9. DNI con letra incorrecta.
10. Teléfono con menos de 9 cifras.
11. Contraseña demasiado corta.
12. Contraseñas distintas.
13. Selección vacía en un `select` obligatorio.
14. Crear un registro válido.
15. Editar un registro.
16. Cancelar una edición.
17. Eliminar todos los registros y comprobar el bloque vacío.

---

# ARCHIVOS PRINCIPALES DE ESTE MODELO

```text
src/app/interfaces/ipaciente.interface.ts
src/app/components/paciente-reactive/paciente-reactive.component.ts
src/app/components/paciente-reactive/paciente-reactive.component.html
src/app/components/paciente-reactive/paciente-reactive.component.css
```
