import { Component, inject } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IUsuario } from "../../interfaces/iusuario.interface";
import { UsuarioService } from "../../services/usuario.service";

@Component({
    imports: [ReactiveFormsModule],
    selector: "app-usuario-reactive",
    styleUrl: "./usuario-reactive.css",
    templateUrl: "./usuario-reactive.html",
})
export class UsuarioReactive {
    modelForm: FormGroup;
    private usuarioService = inject(UsuarioService);
    mensaje: string;

    constructor() {
        this.mensaje = "";
        this.modelForm = new FormGroup(
            {
                id: new FormControl(-1),
                nombre: new FormControl(null, [Validators.required, Validators.minLength(3)]),
                email: new FormControl(null, [
                    Validators.required,
                    Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
                ]),
                edad: new FormControl(null, [Validators.required, Validators.min(18), Validators.max(120)]),
                dni: new FormControl(null, [
                    Validators.required,
                    Validators.pattern(/^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/),
                ]),
                password: new FormControl(null, [Validators.required, Validators.minLength(5)]),
                repitePassword: new FormControl(null, [Validators.required, Validators.minLength(5)]),
            },
            [this.passValidator],
        );
    }

    getDataForm(): void {
        this.mensaje = "";

        if (this.modelForm.invalid) {
            this.modelForm.markAllAsTouched();
            return;
        }

        const usuario = this.modelForm.value as IUsuario;

        // Control adicional de espacios, porque required no considera inválido "   ".
        usuario.nombre = String(usuario.nombre ?? "").trim();
        usuario.email = String(usuario.email ?? "").trim();
        usuario.dni = String(usuario.dni ?? "").trim().toUpperCase();

        if (usuario.nombre === "" || usuario.email === "" || usuario.dni === "") {
            alert("Los campos de texto no pueden contener solo espacios.");
            return;
        }

        const registrado = this.usuarioService.registrarUsuario(usuario);

        if (!registrado) {
            alert("Ya existe un usuario con ese email.");
            return;
        }

        this.mensaje = "Usuario registrado correctamente.";
        this.modelForm.reset();
        this.modelForm.get("id")?.setValue(-1);
    }

    checkControl(formControlName: string, validator: string): boolean | undefined {
        return (
            this.modelForm.get(formControlName)?.hasError(validator) &&
            this.modelForm.get(formControlName)?.touched
        );
    }

    passValidator(formValue: AbstractControl): any {
        const pass1 = formValue.get("password")?.value;
        const pass2 = formValue.get("repitePassword")?.value;

        return pass1 !== pass2 ? { passwordnotmatches: true } : null;
    }
}
