import { Component } from "@angular/core";
import { BindingComponent } from "./components/binding-component/binding-component";
import { IfComponent } from "./components/if-component/if-component";
import { ForComponent } from "./components/for-component/for-component";
import { SwitchComponent } from "./components/switch-component/switch-component";
import { SignalComponent } from "./components/signal-component/signal-component";

@Component({
    // Como trabajamos con componentes standalone, los componentes hijos se importan aquí.
    imports: [BindingComponent, IfComponent, ForComponent, SwitchComponent, SignalComponent],
    selector: "app-root",
    styleUrl: "./app.css",
    templateUrl: "./app.html",
})
export class App {
    // Esta propiedad decide qué ejemplo se muestra en pantalla.
    ejemploActivo: string;

    constructor() {
        // Al arrancar la aplicación mostramos primero el ejemplo de Data Binding.
        this.ejemploActivo = "binding";
    }

    // Cambiamos la propiedad anterior cuando el usuario pulsa un botón del menú.
    cambiarEjemplo(ejemplo: string): void {
        this.ejemploActivo = ejemplo;
    }
}
