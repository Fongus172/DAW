import { Component, input } from "@angular/core";

@Component({
    imports: [],
    selector: "app-input-signal",
    styleUrl: "./input-signal.component.css",
    templateUrl: "./input-signal.component.html",
})
export class InputSignalComponent {
    /*
     * input.required<string>() crea un Input Signal obligatorio.
     * El componente padre DEBE enviar este valor.
     */
    titulo = input.required<string>();

    /*
     * input(0) crea un Input Signal opcional con valor inicial 0.
     * Si el padre no manda nada, se conserva ese valor.
     */
    nivel = input(0);
}
