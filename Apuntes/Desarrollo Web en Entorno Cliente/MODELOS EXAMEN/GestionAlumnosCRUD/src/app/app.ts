import { Component } from "@angular/core";
import { AlumnosCrudComponent } from "./components/alumnos-crud/alumnos-crud.component";

@Component({
    selector: "app-root",
    // Para utilizar un componente hijo en el HTML de App debemos importarlo aquí.
    imports: [AlumnosCrudComponent],
    templateUrl: "./app.html",
    styleUrl: "./app.css",
})
export class App {}
