import { Component } from "@angular/core";
import { ISerie } from "./interfaces/iserie.interface";
import { ReservaForm } from "./components/reserva-form/reserva-form";
import { ReservaList } from "./components/reserva-list/reserva-list";
import { Resumen } from "./components/resumen/resumen";
import { SerieList } from "./components/serie-list/serie-list";
import { UsuarioReactive } from "./components/usuario-reactive/usuario-reactive";

@Component({
    imports: [SerieList, ReservaForm, ReservaList, UsuarioReactive, Resumen],
    selector: "app-root",
    styleUrl: "./app.css",
    templateUrl: "./app.html",
})
export class App {
    serieSeleccionada: ISerie | null;

    constructor() {
        this.serieSeleccionada = null;
    }

    seleccionarSerie($event: ISerie): void {
        this.serieSeleccionada = $event;

        // Scroll sencillo para que el usuario vea el formulario de reserva.
        setTimeout(function () {
            document.getElementById("reservas")?.scrollIntoView({ behavior: "smooth" });
        }, 0);
    }
}
