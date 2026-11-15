import { Component } from "@angular/core";

@Component({
    imports: [],
    selector: "app-if-component",
    styleUrl: "./if-component.css",
    templateUrl: "./if-component.html",
})
export class IfComponent {
    edad: number;

    constructor() {
        this.edad = 18;
    }

    // Igual que en el ejemplo del profesor, recogemos el valor directamente desde $event.
    cambiarEdad($event: any): void {
        const valor = $event.target.value;

        if (valor === "" || valor === undefined || valor === null) {
            this.edad = -1;
        } else {
            this.edad = Number(valor);
        }
    }
}
