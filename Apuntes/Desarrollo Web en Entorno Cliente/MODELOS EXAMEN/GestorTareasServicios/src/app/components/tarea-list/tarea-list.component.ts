import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { ITarea } from "../../interfaces/itarea.interface";
import { TareaService } from "../../services/tarea.service";
import { TareaCardComponent } from "../tarea-card/tarea-card.component";

@Component({
    selector: "app-tarea-list",
    imports: [TareaCardComponent],
    templateUrl: "./tarea-list.component.html",
    styleUrl: "./tarea-list.component.css",

    /*
     * El profesor utiliza Eager en sus listados cuando varios componentes modifican
     * un array compartido mediante un servicio. Repetimos el mismo patrón.
     */
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class TareaListComponent implements OnInit {
    tareas: ITarea[];

    private tareaService = inject(TareaService);

    constructor() {
        this.tareas = [];
    }

    ngOnInit(): void {
        // Obtenemos del servicio la referencia al array compartido.
        this.tareas = this.tareaService.getAllTareas();
    }

    eliminarCompletadas(): void {
        this.tareaService.deleteCompletadas();
    }
}
