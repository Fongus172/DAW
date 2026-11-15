import { Component, signal } from "@angular/core";

@Component({
    imports: [],
    selector: "app-signal-component",
    styleUrl: "./signal-component.css",
    templateUrl: "./signal-component.html",
})
export class SignalComponent {
    // signal() crea un valor reactivo. Para leerlo se llama como una función: visitas().
    visitas = signal(0);
    nombreSala = signal("Sala principal");

    sumarVisita(): void {
        // set() sustituye el valor actual del signal.
        this.visitas.set(this.visitas() + 1);
    }

    reiniciarVisitas(): void {
        this.visitas.set(0);
    }

    cambiarSala(): void {
        if (this.nombreSala() === "Sala principal") {
            this.nombreSala.set("Sala temporal");
        } else {
            this.nombreSala.set("Sala principal");
        }
    }
}
