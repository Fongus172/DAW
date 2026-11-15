import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ILibro } from "../../interfaces/ilibro.interface";

@Component({
    imports: [],
    selector: "app-libro-detalle",
    styleUrl: "./libro-detalle.component.css",
    templateUrl: "./libro-detalle.component.html",
})
export class LibroDetalleComponent {
    // El detalle recibe el libro seleccionado desde el padre.
    @Input() libro: ILibro;

    // El hijo avisa al padre cuando el usuario quiere cerrar el detalle.
    @Output() cerrarDetalle: EventEmitter<void> = new EventEmitter();

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

    cerrar(): void {
        // Este EventEmitter no necesita mandar información, por eso usa void.
        this.cerrarDetalle.emit();
    }
}
