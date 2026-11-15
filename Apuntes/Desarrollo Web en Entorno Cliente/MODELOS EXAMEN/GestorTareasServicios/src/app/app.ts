import { Component } from "@angular/core";
import { TareaFormComponent } from "./components/tarea-form/tarea-form.component";
import { TareaListComponent } from "./components/tarea-list/tarea-list.component";
import { TareaStatsComponent } from "./components/tarea-stats/tarea-stats.component";

@Component({
    selector: "app-root",
    // App solamente organiza los componentes principales.
    imports: [TareaFormComponent, TareaStatsComponent, TareaListComponent],
    templateUrl: "./app.html",
    styleUrl: "./app.css",
})
export class App {}
