import { Component, inject, Input } from "@angular/core";
import { ITarea } from "../../interfaces/itarea.interface";
import { TareaService } from "../../services/tarea.service";

@Component({
    selector: "app-tarea-card",
    imports: [],
    templateUrl: "./tarea-card.component.html",
    styleUrl: "./tarea-card.component.css",
})
export class TareaCardComponent {
    // El listado padre entrega la tarea que esta tarjeta debe mostrar.
    @Input() tarea: ITarea;

    // La tarjeta también puede pedir el servicio directamente.
    // Así no necesita emitir un Output al padre para cada operación.
    private tareaService = inject(TareaService);

    constructor() {
        // Valor inicial para satisfacer el modo estricto de TypeScript.
        this.tarea = {
            id: -1,
            titulo: "Tarea no definida",
            descripcion: "",
            prioridad: "Media",
            completada: false,
        };
    }

    cambiarEstado(): void {
        this.tareaService.cambiarEstado(this.tarea.id);
    }

    eliminar(): void {
        this.tareaService.deleteTarea(this.tarea.id);
    }
}
