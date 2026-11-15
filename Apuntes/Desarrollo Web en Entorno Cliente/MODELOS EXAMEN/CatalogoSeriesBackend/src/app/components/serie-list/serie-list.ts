import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ISerie } from "../../interfaces/iserie.interface";
import { SeriesServices } from "../../services/series-services";
import { SerieCard } from "../serie-card/serie-card";

@Component({
    imports: [SerieCard],
    selector: "app-serie-list",
    styleUrl: "./serie-list.css",
    templateUrl: "./serie-list.html",
    // El profesor utiliza Eager en los listados que dependen de arrays compartidos.
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class SerieList {
    seriesArray: ISerie[];

    private seriesService = inject(SeriesServices);

    constructor() {
        this.seriesArray = [];
    }

    ngOnInit(): void {
        // Recibimos la misma referencia del array almacenado en el servicio.
        this.seriesArray = this.seriesService.getAllSeries();
    }

    estaCargando(): boolean {
        return this.seriesService.getCargando();
    }

    getError(): string {
        return this.seriesService.getError();
    }

    recargarDesdeApi(): void {
        this.seriesService.connectSeries();
    }
}
