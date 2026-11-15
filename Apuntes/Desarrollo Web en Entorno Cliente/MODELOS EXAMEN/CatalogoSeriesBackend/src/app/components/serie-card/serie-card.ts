import { Component, inject, Input } from "@angular/core";
import { ISerie } from "../../interfaces/iserie.interface";
import { SeriesServices } from "../../services/series-services";

@Component({
    imports: [],
    selector: "app-serie-card",
    styleUrl: "./serie-card.css",
    templateUrl: "./serie-card.html",
})
export class SerieCard {
    // El padre envía una serie completa a cada tarjeta.
    @Input() miSerie: ISerie;

    // La tarjeta puede pedir al servicio que elimine esa serie del array compartido.
    private seriesServices = inject(SeriesServices);

    constructor() {
        // Inicializamos el Input para mantener el estilo sencillo trabajado en clase.
        this.miSerie = {
            id: -1,
            title: "Serie no definida",
            creator: "",
            rating: 0,
            dates: "",
            image: "",
            channel: "",
        };
    }

    deleteSerie(): void {
        this.seriesServices.deleteSerieById(this.miSerie.id);
    }
}
