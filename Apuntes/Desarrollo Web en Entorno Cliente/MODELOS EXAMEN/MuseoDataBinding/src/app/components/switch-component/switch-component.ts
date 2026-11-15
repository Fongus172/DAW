import { Component } from "@angular/core";

@Component({
    imports: [],
    selector: "app-switch-component",
    styleUrl: "./switch-component.css",
    templateUrl: "./switch-component.html",
})
export class SwitchComponent {
    rol: string;

    constructor() {
        this.rol = "visitante";
    }

    cambiarRol(nuevoRol: string): void {
        this.rol = nuevoRol;
    }
}
