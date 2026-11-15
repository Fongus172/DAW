import { Component } from "@angular/core";
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { IPaciente } from "../../interfaces/ipaciente.interface";

@Component({
    selector: "app-paciente-reactive",
    imports: [ReactiveFormsModule],
    templateUrl: "./paciente-reactive.component.html",
    styleUrl: "./paciente-reactive.component.css",
})
export class PacienteReactiveComponent {
    // FormGroup representa el formulario completo en TypeScript.
    // Cada propiedad que contiene será un FormControl.
    modelForm: FormGroup;

    // Array que usamos como "base de datos" local para este ejemplo.
    // En otro proyecto veremos cómo sustituirlo por un servicio/backend.
    pacientes: IPaciente[];

    constructor() {
        // Inicializamos algunos pacientes para poder probar el listado,
        // la edición y el borrado desde el primer momento.
        this.pacientes = [
            {
                id: 1,
                nombre: "Laura",
                apellidos: "García Pérez",
                email: "laura@correo.com",
                edad: 31,
                dni: "12345678Z",
                telefono: "612345678",
                grupoSanguineo: "A+",
                password: "12345",
                repitePassword: "12345",
            },
            {
                id: 2,
                nombre: "Diego",
                apellidos: "Martín Ruiz",
                email: "diego@correo.com",
                edad: 47,
                dni: "00000000T",
                telefono: "698765432",
                grupoSanguineo: "O-",
                password: "abcde",
                repitePassword: "abcde",
            },
        ];

        // En Reactive Forms los campos se crean en TypeScript.
        // El segundo parámetro de cada FormControl contiene sus validadores.
        this.modelForm = new FormGroup(
            {
                // id = -1 significa que estamos creando un paciente nuevo.
                // Si el id es distinto de -1, estaremos editando uno existente.
                id: new FormControl(-1),

                nombre: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(3),
                ]),

                apellidos: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(3),
                ]),

                email: new FormControl(null, [
                    Validators.required,
                    Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
                ]),

                edad: new FormControl(null, [
                    Validators.required,
                    Validators.min(0),
                    Validators.max(120),
                ]),

                dni: new FormControl(null, [
                    Validators.required,
                    Validators.pattern(/^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/),
                    this.dniValidator,
                ]),

                telefono: new FormControl(null, [
                    Validators.required,
                    Validators.pattern(/^[6789][0-9]{8}$/),
                ]),

                grupoSanguineo: new FormControl("", [Validators.required]),

                password: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(5),
                ]),

                repitePassword: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(5),
                ]),
            },
            // Este validador se aplica al FormGroup completo porque necesita
            // comparar dos controles distintos: password y repitePassword.
            [this.passValidator],
        );
    }

    // Se ejecuta al enviar el formulario mediante (ngSubmit).
    // En Reactive Forms NO necesitamos recibir el formulario como parámetro:
    // los datos ya están disponibles en this.modelForm.value.
    guardarPaciente(): void {
        // Por seguridad, si el formulario no es válido no guardamos nada.
        if (this.modelForm.invalid) {
            // Marca todos los campos como "touched" para que aparezcan los errores.
            this.modelForm.markAllAsTouched();
            return;
        }

        const paciente = this.modelForm.value as IPaciente;

        if (paciente.id === -1) {
            // Alta: calculamos un id sencillo y añadimos el paciente al array.
            paciente.id = this.obtenerNuevoId();
            this.pacientes.push(paciente);
        } else {
            // Edición: buscamos en qué posición está el paciente original.
            const posicion = this.pacientes.findIndex(function (pacienteArray) {
                return pacienteArray.id === paciente.id;
            });

            if (posicion !== -1) {
                this.pacientes[posicion] = paciente;
            }
        }

        this.limpiarFormulario();
    }

    // Carga en el formulario los datos del paciente que queremos editar.
    editarPaciente(paciente: IPaciente): void {
        // setValue obliga a proporcionar un valor para TODOS los controles.
        // Es muy útil cuando el objeto tiene exactamente la misma estructura.
        this.modelForm.setValue({
            id: paciente.id,
            nombre: paciente.nombre,
            apellidos: paciente.apellidos,
            email: paciente.email,
            edad: paciente.edad,
            dni: paciente.dni,
            telefono: paciente.telefono,
            grupoSanguineo: paciente.grupoSanguineo,
            password: paciente.password,
            repitePassword: paciente.repitePassword,
        });
    }

    eliminarPaciente(id: number): void {
        const posicion = this.pacientes.findIndex(function (paciente) {
            return paciente.id === id;
        });

        if (posicion !== -1) {
            this.pacientes.splice(posicion, 1);
        }

        // Si estábamos editando precisamente ese paciente, limpiamos el formulario.
        if (this.modelForm.get("id")?.value === id) {
            this.limpiarFormulario();
        }
    }

    cancelarEdicion(): void {
        this.limpiarFormulario();
    }

    // Método auxiliar parecido al utilizado por el profesor.
    // Devuelve true cuando un control tiene un error concreto Y el usuario ya lo ha tocado.
    checkControl(formControlName: string, validator: string): boolean | undefined {
        return (
            this.modelForm.get(formControlName)?.hasError(validator) &&
            this.modelForm.get(formControlName)?.touched
        );
    }

    // Validador personalizado aplicado al FormGroup completo.
    // Devuelve null cuando todo está correcto y un objeto cuando hay error.
    passValidator(formValue: AbstractControl): any {
        const pass1 = formValue.get("password")?.value;
        const pass2 = formValue.get("repitePassword")?.value;

        return pass1 !== pass2 ? { passwordnotmatches: true } : null;
    }

    // Validador personalizado para comprobar la letra REAL de un DNI español.
    // Primero dejamos que Validators.required y Validators.pattern hagan su trabajo.
    dniValidator(control: AbstractControl): any {
        const valor = control.value;

        // Si todavía no hay valor, no devolvemos aquí el error porque
        // Validators.required ya se encarga del campo vacío.
        if (valor === null || valor === undefined || valor === "") {
            return null;
        }

        const dni = String(valor).toUpperCase();

        // Si ni siquiera cumple el formato básico, dejamos que pattern muestre su error.
        if (!/^[0-9]{8}[A-Z]$/.test(dni)) {
            return null;
        }

        const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
        const numero = Number(dni.substring(0, 8));
        const letraCorrecta = letras[numero % 23];
        const letraIntroducida = dni.charAt(8);

        return letraCorrecta === letraIntroducida ? null : { dniletter: true };
    }

    private obtenerNuevoId(): number {
        if (this.pacientes.length === 0) {
            return 1;
        }

        let idMayor = this.pacientes[0].id;

        this.pacientes.forEach(function (paciente) {
            if (paciente.id > idMayor) {
                idMayor = paciente.id;
            }
        });

        return idMayor + 1;
    }

    private limpiarFormulario(): void {
        // reset() deja vacíos los controles y también reinicia estados como touched/dirty.
        this.modelForm.reset();

        // Volvemos a -1 para indicar que el siguiente guardado será un alta.
        this.modelForm.get("id")?.setValue(-1);

        // El select tiene como opción inicial la cadena vacía.
        this.modelForm.get("grupoSanguineo")?.setValue("");
    }
}
