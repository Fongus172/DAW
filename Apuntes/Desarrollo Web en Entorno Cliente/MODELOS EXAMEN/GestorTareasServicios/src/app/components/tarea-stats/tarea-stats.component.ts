import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TareaService } from "../../services/tarea.service";

@Component({
    selector: "app-tarea-stats",
    imports: [],
    templateUrl: "./tarea-stats.component.html",
    styleUrl: "./tarea-stats.component.css",
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class TareaStatsComponent {
    /*
     * Este componente NO es padre ni hijo del formulario en cuanto a datos.
     * Aun así puede conocer el estado de las tareas porque ambos usan TareaService.
     */
    private tareaService = inject(TareaService);

    getTotal(): number {
        return this.tareaService.getNumeroTareas();
    }

    getCompletadas(): number {
        return this.tareaService.getNumeroCompletadas();
    }

    getPendientes(): number {
        return this.tareaService.getNumeroPendientes();
    }
}
