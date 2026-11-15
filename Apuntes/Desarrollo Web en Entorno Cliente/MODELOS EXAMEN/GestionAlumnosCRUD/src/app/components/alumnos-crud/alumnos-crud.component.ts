import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IAlumno } from "../../interfaces/ialumno.interface";

@Component({
    selector: "app-alumnos-crud",
    // FormsModule es necesario porque usamos [(ngModel)] en los campos del formulario y del buscador.
    imports: [FormsModule],
    templateUrl: "./alumnos-crud.component.html",
    styleUrl: "./alumnos-crud.component.css",
})
export class AlumnosCrudComponent {
    // Array principal. En un examen, este podría ser un array de productos, libros, clientes, etc.
    alumnos: IAlumno[];

    // Array auxiliar que mostramos en la tabla cuando se realiza una búsqueda.
    alumnosFiltrados: IAlumno[];

    // Propiedades enlazadas con los inputs mediante [(ngModel)].
    nombre: string;
    apellidos: string;
    edad: number | null;
    curso: string;
    email: string;
    nota: number | null;

    // Si idEdicion vale -1 significa que estamos creando un alumno nuevo.
    // Si contiene otro número, estamos editando el alumno con ese id.
    idEdicion: number;

    // Texto del buscador.
    textoBusqueda: string;

    // Mensajes visibles para informar al usuario sin depender únicamente de alert().
    mensajeError: string;
    mensajeCorrecto: string;

    // Usamos un contador para dar un id diferente a cada alumno nuevo.
    siguienteId: number;

    constructor() {
        // Datos iniciales para poder probar listar, buscar, editar y eliminar nada más abrir la aplicación.
        this.alumnos = [
            {
                id: 1,
                nombre: "Lucía",
                apellidos: "Gómez Pérez",
                edad: 20,
                curso: "2º DAW",
                email: "lucia@centro.es",
                nota: 8.2,
            },
            {
                id: 2,
                nombre: "Mario",
                apellidos: "Ruiz Sánchez",
                edad: 22,
                curso: "2º DAM",
                email: "mario@centro.es",
                nota: 6.5,
            },
            {
                id: 3,
                nombre: "Sara",
                apellidos: "López Díaz",
                edad: 19,
                curso: "1º DAW",
                email: "sara@centro.es",
                nota: 9.1,
            },
        ];

        // Al principio mostramos todos los alumnos.
        this.alumnosFiltrados = this.alumnos;

        // Inicializamos las propiedades del formulario.
        this.nombre = "";
        this.apellidos = "";
        this.edad = null;
        this.curso = "";
        this.email = "";
        this.nota = null;

        this.idEdicion = -1;
        this.textoBusqueda = "";
        this.mensajeError = "";
        this.mensajeCorrecto = "";
        this.siguienteId = 4;
    }

    guardarAlumno(): void {
        // Limpiamos mensajes anteriores cada vez que se intenta guardar.
        this.mensajeError = "";
        this.mensajeCorrecto = "";

        // trim() evita aceptar como válido un texto formado únicamente por espacios.
        if (
            this.nombre.trim() === "" ||
            this.apellidos.trim() === "" ||
            this.curso.trim() === "" ||
            this.email.trim() === ""
        ) {
            this.mensajeError = "Los campos de texto son obligatorios y no pueden contener solo espacios.";
            return;
        }

        // Los input type="number" pueden quedar vacíos, por eso también comprobamos null.
        if (this.edad === null || this.nota === null) {
            this.mensajeError = "La edad y la nota son obligatorias.";
            return;
        }

        // Validamos rangos numéricos y evitamos edades decimales.
        if (!Number.isInteger(this.edad) || this.edad < 16 || this.edad > 99) {
            this.mensajeError = "La edad debe ser un número entero entre 16 y 99.";
            return;
        }

        if (this.nota < 0 || this.nota > 10) {
            this.mensajeError = "La nota debe estar entre 0 y 10.";
            return;
        }

        // Comprobación sencilla del email.
        if (!this.email.includes("@") || !this.email.includes(".")) {
            this.mensajeError = "Introduce un correo electrónico válido.";
            return;
        }

        // find() devuelve el primer alumno cuyo email coincida.
        // Cuando editamos, permitimos conservar el email del alumno que estamos modificando.
        const alumnoConMismoEmail = this.alumnos.find((alumno) => {
            return alumno.email.toLowerCase() === this.email.trim().toLowerCase() && alumno.id !== this.idEdicion;
        });

        if (alumnoConMismoEmail !== undefined) {
            this.mensajeError = "Ya existe un alumno con ese correo electrónico.";
            return;
        }

        if (this.idEdicion === -1) {
            // ALTA: construimos un nuevo objeto respetando la interfaz IAlumno.
            const nuevoAlumno: IAlumno = {
                id: this.siguienteId,
                nombre: this.nombre.trim(),
                apellidos: this.apellidos.trim(),
                edad: this.edad,
                curso: this.curso.trim(),
                email: this.email.trim(),
                nota: this.nota,
            };

            // push() añade el nuevo alumno al final del array.
            this.alumnos.push(nuevoAlumno);
            this.siguienteId++;
            this.mensajeCorrecto = "Alumno añadido correctamente.";
        } else {
            // EDICIÓN: findIndex() nos devuelve la posición del alumno dentro del array.
            const posicion = this.alumnos.findIndex((alumno) => alumno.id === this.idEdicion);

            // findIndex() devuelve -1 si no encuentra el elemento.
            if (posicion === -1) {
                this.mensajeError = "No se ha encontrado el alumno que intentabas editar.";
                return;
            }

            // Sustituimos el objeto de esa posición por los datos modificados.
            this.alumnos[posicion] = {
                id: this.idEdicion,
                nombre: this.nombre.trim(),
                apellidos: this.apellidos.trim(),
                edad: this.edad,
                curso: this.curso.trim(),
                email: this.email.trim(),
                nota: this.nota,
            };

            this.mensajeCorrecto = "Alumno actualizado correctamente.";
        }

        // Después de guardar, limpiamos el formulario y recalculamos la búsqueda.
        this.limpiarFormulario();
        this.filtrarAlumnos();
    }

    editarAlumno(alumno: IAlumno): void {
        // Guardamos el id para saber que el siguiente guardado será una edición.
        this.idEdicion = alumno.id;

        // Copiamos los valores del alumno en las propiedades enlazadas al formulario.
        // Gracias a [(ngModel)] los inputs se rellenan automáticamente.
        this.nombre = alumno.nombre;
        this.apellidos = alumno.apellidos;
        this.edad = alumno.edad;
        this.curso = alumno.curso;
        this.email = alumno.email;
        this.nota = alumno.nota;

        this.mensajeError = "";
        this.mensajeCorrecto = "Editando a " + alumno.nombre + " " + alumno.apellidos + ".";
    }

    cancelarEdicion(): void {
        this.limpiarFormulario();
        this.mensajeError = "";
        this.mensajeCorrecto = "Edición cancelada.";
    }

    eliminarAlumno(id: number): void {
        this.mensajeError = "";
        this.mensajeCorrecto = "";

        // findIndex() busca en qué posición está el alumno que queremos eliminar.
        const posicion = this.alumnos.findIndex((alumno) => alumno.id === id);

        if (posicion === -1) {
            this.mensajeError = "No se ha encontrado el alumno que intentabas eliminar.";
            return;
        }

        // splice(posicion, 1) elimina un elemento a partir de la posición indicada.
        this.alumnos.splice(posicion, 1);

        // Si justo estábamos editando el alumno eliminado, limpiamos el formulario.
        if (this.idEdicion === id) {
            this.limpiarFormulario();
        }

        this.filtrarAlumnos();
        this.mensajeCorrecto = "Alumno eliminado correctamente.";
    }

    filtrarAlumnos(): void {
        // Pasamos la búsqueda a minúsculas y quitamos espacios de los extremos.
        const texto = this.textoBusqueda.trim().toLowerCase();

        if (texto === "") {
            // Si no se busca nada mostramos todos los alumnos.
            this.alumnosFiltrados = this.alumnos;
            return;
        }

        // filter() crea un array nuevo únicamente con los alumnos que cumplen la condición.
        this.alumnosFiltrados = this.alumnos.filter((alumno) => {
            return (
                alumno.nombre.toLowerCase().includes(texto) ||
                alumno.apellidos.toLowerCase().includes(texto) ||
                alumno.curso.toLowerCase().includes(texto) ||
                alumno.email.toLowerCase().includes(texto)
            );
        });
    }

    subirMedioPunto(): void {
        // map() recorre todos los elementos y devuelve un array nuevo.
        // En este ejemplo suma 0,5 a cada nota sin permitir superar el 10.
        this.alumnos = this.alumnos.map((alumno) => {
            return {
                id: alumno.id,
                nombre: alumno.nombre,
                apellidos: alumno.apellidos,
                edad: alumno.edad,
                curso: alumno.curso,
                email: alumno.email,
                nota: Math.min(10, Number((alumno.nota + 0.5).toFixed(1))),
            };
        });

        this.filtrarAlumnos();
        this.mensajeError = "";
        this.mensajeCorrecto = "Se ha sumado 0,5 a las notas sin superar el 10.";
    }

    obtenerMedia(): number {
        if (this.alumnos.length === 0) {
            return 0;
        }

        let suma = 0;

        // forEach() recorre el array. Aquí lo usamos para sumar todas las notas.
        this.alumnos.forEach((alumno) => {
            suma += alumno.nota;
        });

        return suma / this.alumnos.length;
    }

    private limpiarFormulario(): void {
        this.nombre = "";
        this.apellidos = "";
        this.edad = null;
        this.curso = "";
        this.email = "";
        this.nota = null;
        this.idEdicion = -1;
    }
}
