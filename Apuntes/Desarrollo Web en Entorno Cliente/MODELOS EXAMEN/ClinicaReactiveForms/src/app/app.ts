import { Component } from "@angular/core";
import { PacienteReactiveComponent } from "./components/paciente-reactive/paciente-reactive.component";

@Component({
    selector: "app-root",
    imports: [PacienteReactiveComponent],
    templateUrl: "./app.html",
    styleUrl: "./app.css",
})
export class App {}
