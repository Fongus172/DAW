import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ILibro } from "../../interfaces/ilibro.interface";

@Component({
    imports: [],
    selector: "app-libro-card",
    styleUrl: "./libro-card.component.css",
    templateUrl: "./libro-card.component.html",
})
export class LibroCardComponent {
    /*
     * @Input(): PADRE -> HIJO
     * El componente padre puede introducir un valor dentro de esta propiedad.
     * En este caso recibimos un OBJETO ILibro completo.
     */
    @Input() libro: ILibro;

    /*
     * Otro Input sencillo para practicar que un hijo puede recibir más de un dato.
     * El padre enviará el índice que ocupa la tarjeta en el @for.
     */
    @Input() posicion: number;

    /*
     * @Output(): HIJO -> PADRE
     * EventEmitter permite crear nuestro propio evento personalizado.
     * <number> indica que el evento enviará un número, en este caso el id del libro.
     */
    @Output() seleccionarLibro: EventEmitter<number> = new EventEmitter();
    @Output() cambiarDisponibilidad: EventEmitter<number> = new EventEmitter();
    @Output() eliminarLibro: EventEmitter<number> = new EventEmitter();

    constructor() {
        // Los Inputs se inicializan para que TypeScript no los deje sin valor.
        // Cuando el padre cargue el componente, Angular sustituirá estos valores.
        this.libro = {
            id: -1,
            titulo: "Libro no definido",
            autor: "Autor no definido",
            genero: "Sin género",
            paginas: 0,
            disponible: false,
        };

        this.posicion = 0;
    }

    seleccionar(): void {
        // emit() lanza el evento hacia el componente padre.
        // El valor enviado se recibirá allí mediante $event.
        this.seleccionarLibro.emit(this.libro.id);
    }

    cambiarEstado(): void {
        this.cambiarDisponibilidad.emit(this.libro.id);
    }

    eliminar(): void {
        this.eliminarLibro.emit(this.libro.id);
    }
}
