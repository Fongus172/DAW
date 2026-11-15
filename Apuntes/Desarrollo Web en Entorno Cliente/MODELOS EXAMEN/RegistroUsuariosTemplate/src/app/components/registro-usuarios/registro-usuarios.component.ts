import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IUsuario } from '../../interfaces/Iusuario.interface';

@Component({
    // FormsModule es obligatorio para usar ngForm y ngModel en formularios Template.
    imports: [FormsModule],
    selector: 'app-registro-usuarios',
    styleUrl: './registro-usuarios.component.css',
    templateUrl: './registro-usuarios.component.html',
})
export class RegistroUsuariosComponent {
    // Array donde guardamos los usuarios que se registren durante la ejecución.
    usuarios: IUsuario[];

    // Mensajes para informar al usuario sin depender siempre de alert().
    mensajeRegistro: string;
    mensajeLogin: string;
    loginCorrecto: boolean;

    constructor() {
        this.usuarios = [];
        this.mensajeRegistro = '';
        this.mensajeLogin = '';
        this.loginCorrecto = false;
    }

    registrar(registroForm: NgForm): void {
        // Si alguna validación de Angular falla, marcamos todos los campos como tocados
        // para que se vean sus mensajes de error y detenemos el registro.
        if (registroForm.invalid) {
            registroForm.control.markAllAsTouched();
            this.mensajeRegistro = 'Revisa los campos del formulario.';
            return;
        }

        // Aunque Angular ya valide el formulario, comprobamos también los casos extremos.
        // trim() evita aceptar cadenas que solo contienen espacios.
        const nombre = String(registroForm.value.nombre ?? '').trim();
        const apellidos = String(registroForm.value.apellidos ?? '').trim();
        const usuario = String(registroForm.value.usuario ?? '').trim();
        const email = String(registroForm.value.email ?? '').trim().toLowerCase();
        const dni = String(registroForm.value.dni ?? '').trim().toUpperCase();
        const edad = Number(registroForm.value.edad);
        const telefono = String(registroForm.value.telefono ?? '').trim();
        const password = String(registroForm.value.password ?? '');
        const repitePassword = String(registroForm.value.repitePassword ?? '');
        const provincia = String(registroForm.value.provincia ?? '').trim();
        const aceptaCondiciones = registroForm.value.aceptaCondiciones === true;

        // required no evita que el usuario escriba únicamente espacios.
        if (
            nombre === '' ||
            apellidos === '' ||
            usuario === '' ||
            email === '' ||
            dni === '' ||
            telefono === '' ||
            password.trim() === '' ||
            repitePassword.trim() === '' ||
            provincia === ''
        ) {
            this.mensajeRegistro = 'No se permiten campos vacíos ni textos formados solo por espacios.';
            return;
        }

        // Para la edad comprobamos null/NaN, rango y que sea un número entero.
        if (!Number.isInteger(edad) || edad < 18 || edad > 120) {
            this.mensajeRegistro = 'La edad debe ser un número entero entre 18 y 120.';
            return;
        }

        // Comprobación adicional de formatos. El HTML también tiene pattern,
        // pero tener la comprobación aquí nos protege si los datos llegan de otra forma.
        const patronDni = /^[0-9]{8}[A-Z]$/;
        const patronTelefono = /^[0-9]{9}$/;

        if (!patronDni.test(dni)) {
            this.mensajeRegistro = 'El DNI debe tener 8 números y una letra.';
            return;
        }

        if (!patronTelefono.test(telefono)) {
            this.mensajeRegistro = 'El teléfono debe tener exactamente 9 números.';
            return;
        }

        if (password !== repitePassword) {
            this.mensajeRegistro = 'Las contraseñas no coinciden.';
            return;
        }

        if (!aceptaCondiciones) {
            this.mensajeRegistro = 'Debes aceptar las condiciones.';
            return;
        }

        // some() devuelve true si encuentra un elemento que cumple la condición.
        // Lo usamos para impedir usuarios, correos o DNI duplicados.
        const usuarioDuplicado = this.usuarios.some(function (item) {
            return item.usuario.toLowerCase() === usuario.toLowerCase();
        });

        const emailDuplicado = this.usuarios.some(function (item) {
            return item.email.toLowerCase() === email;
        });

        const dniDuplicado = this.usuarios.some(function (item) {
            return item.dni === dni;
        });

        if (usuarioDuplicado || emailDuplicado || dniDuplicado) {
            this.mensajeRegistro = 'Ya existe un usuario con ese nombre de usuario, email o DNI.';
            return;
        }

        // Creamos un objeto que cumple la interfaz IUsuario.
        const nuevoUsuario: IUsuario = {
            nombre: nombre,
            apellidos: apellidos,
            usuario: usuario,
            email: email,
            dni: dni,
            edad: edad,
            telefono: telefono,
            password: password,
            provincia: provincia,
            aceptaCondiciones: aceptaCondiciones,
        };

        // push() añade el nuevo usuario al final del array.
        this.usuarios.push(nuevoUsuario);
        this.mensajeRegistro = 'Usuario registrado correctamente.';

        // resetForm() limpia los campos y también reinicia el estado touched/dirty del formulario.
        registroForm.resetForm();
    }

    iniciarSesion(loginForm: NgForm): void {
        this.loginCorrecto = false;

        if (loginForm.invalid) {
            loginForm.control.markAllAsTouched();
            this.mensajeLogin = 'Introduce usuario/email y contraseña.';
            return;
        }

        const identificador = String(loginForm.value.identificador ?? '').trim().toLowerCase();
        const password = String(loginForm.value.loginPassword ?? '');

        if (identificador === '' || password.trim() === '') {
            this.mensajeLogin = 'No se permiten valores vacíos o formados solo por espacios.';
            return;
        }

        // find() devuelve el primer usuario que cumpla la condición o undefined si no existe.
        const usuarioEncontrado = this.usuarios.find(function (item) {
            return (
                (item.usuario.toLowerCase() === identificador || item.email.toLowerCase() === identificador) &&
                item.password === password
            );
        });

        if (usuarioEncontrado === undefined) {
            this.mensajeLogin = 'Usuario/email o contraseña incorrectos.';
            return;
        }

        this.loginCorrecto = true;
        this.mensajeLogin = 'Bienvenido, ' + usuarioEncontrado.nombre + '.';
        loginForm.resetForm();
    }

    eliminarUltimoUsuario(): void {
        // pop() elimina el último elemento del array si existe.
        if (this.usuarios.length > 0) {
            this.usuarios.pop();
        }
    }

    vaciarUsuarios(): void {
        // Dejamos el array vacío para poder comprobar también el bloque @empty.
        this.usuarios.splice(0, this.usuarios.length);
    }
}
