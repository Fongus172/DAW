import { Component } from "@angular/core";
import { IObra } from "../../interfaces/iobra.interface";

@Component({
    imports: [],
    selector: "app-for-component",
    styleUrl: "./for-component.css",
    templateUrl: "./for-component.html",
})
export class ForComponent {
    obras: IObra[];
    siguienteId: number;

    constructor() {
        // Array inicial. Cada objeto cumple la interfaz IObra.
        this.obras = [
            { id: 1, titulo: "La noche estrellada", autor: "Vincent van Gogh", anio: 1889, sala: "A" },
            { id: 2, titulo: "Las meninas", autor: "Diego Velázquez", anio: 1656, sala: "B" },
            { id: 3, titulo: "El grito", autor: "Edvard Munch", anio: 1893, sala: "C" },
            { id: 4, titulo: "Guernica", autor: "Pablo Picasso", anio: 1937, sala: "B" },
        ];

        this.siguienteId = 5;
    }

    // push() añade un nuevo elemento al final del array.
    insertarObra(): void {
        const nuevaObra: IObra = {
            id: this.siguienteId,
            titulo: `Obra nueva ${this.siguienteId}`,
            autor: "Autor invitado",
            anio: 2026,
            sala: "D",
        };

        this.obras.push(nuevaObra);
        this.siguienteId++;
    }

    // pop() elimina el último elemento si existe alguno.
    eliminarUltimaObra(): void {
        if (this.obras.length > 0) {
            this.obras.pop();
        }
    }

    // Dejamos el array vacío para demostrar el bloque @empty.
    vaciarMuseo(): void {
        this.obras = [];
    }
}
