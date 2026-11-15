import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from "@angular/core";
import { ISerie } from "../../interfaces/iserie.interface";
import { SeriesService } from "../../services/series.service";
import { SerieCard } from "../serie-card/serie-card";

@Component({
    imports: [SerieCard],
    selector: "app-serie-list",
    styleUrl: "./serie-list.css",
    templateUrl: "./serie-list.html",
    // El profesor usa Eager en listados que dependen de arrays compartidos.
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class SerieList {
    series: ISerie[];
    private seriesService = inject(SeriesService);

    // El listado reenvía al App la serie elegida por una tarjeta.
    @Output() serieSeleccionada: EventEmitter<ISerie> = new EventEmitter();

    constructor() {
        this.series = [];
    }

    ngOnInit(): void {
        // Igual que en el ejemplo del profesor: se obtiene el array al cargar el componente.
        this.series = this.seriesService.getAllSeries();
    }

    reservarSerie($event: ISerie): void {
        this.serieSeleccionada.emit($event);
    }

    recargar(): void {
        this.seriesService.recargarSeries();
    }

    estaCargando(): boolean {
        return this.seriesService.isCargando();
    }

    getError(): string {
        return this.seriesService.getError();
    }
}
