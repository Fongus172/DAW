import { Component } from "@angular/core";
import { LaboratorioComponent } from "./components/laboratorio/laboratorio.component";

@Component({
    imports: [LaboratorioComponent],
    selector: "app-root",
    styleUrl: "./app.css",
    templateUrl: "./app.html",
})
export class App {}
