import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ISerie } from "../../interfaces/iserie.interface";

@Component({
    imports: [],
    selector: "app-serie-card",
    styleUrl: "./serie-card.css",
    templateUrl: "./serie-card.html",
})
export class SerieCard {
    // Input: el componente padre envía una serie completa a cada tarjeta.
    @Input() serie: ISerie;

    // Output: la tarjeta avisa al padre de qué serie quiere reservar el usuario.
    @Output() reservar: EventEmitter<ISerie> = new EventEmitter();

    constructor() {
        // Valor inicial para cumplir el modo estricto de TypeScript.
        this.serie = {
            id: -1,
            title: "Serie no definida",
            creator: "No definido",
            rating: 0,
            dates: "",
            image: "",
            channel: "",
        };
    }

    seleccionarSerie(): void {
        this.reservar.emit(this.serie);
    }
}
