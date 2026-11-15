import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
    // FormsModule es necesario para poder utilizar [(ngModel)] en este componente.
    imports: [FormsModule],
    selector: "app-binding-component",
    styleUrl: "./binding-component.css",
    templateUrl: "./binding-component.html",
})
export class BindingComponent {
    // Propiedades que después utilizaremos desde el HTML.
    nombreMuseo: string;
    nombreVisitante: string;
    edadVisitante: number;
    imagenObra: string;
    webMuseo: string;
    descripcionHtml: string;
    entradaDisponible: boolean;
    obraDestacada: boolean;
    contadorClicks: number;

    constructor() {
        // Inicializamos todas las propiedades para evitar valores undefined.
        this.nombreMuseo = "Museo Angular";
        this.nombreVisitante = "";
        this.edadVisitante = 0;
        this.imagenObra = "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=80";
        this.webMuseo = "https://angular.dev";
        this.descripcionHtml = "Esta obra forma parte de la <strong>exposición principal</strong>.";
        this.entradaDisponible = true;
        this.obraDestacada = true;
        this.contadorClicks = 0;
    }

    // Método que puede llamarse desde una interpolación {{ }}.
    obtenerSaludo(): string {
        if (this.nombreVisitante.trim() === "") {
            return "Bienvenido al museo";
        }

        return `Bienvenido, ${this.nombreVisitante}`;
    }

    // Event Binding: este método se ejecuta cuando pulsamos el botón.
    contarClick(): void {
        this.contadorClicks++;
    }

    // Evento blur: se ejecuta cuando el usuario sale del campo edad.
    validarEdad(): void {
        if (this.edadVisitante < 0 || this.edadVisitante > 120) {
            alert("La edad debe estar comprendida entre 0 y 120 años");
            this.edadVisitante = 0;
        }
    }

    // Ejemplo de uso de $event. Recibimos el evento del input y accedemos a target.value.
    mostrarValorEvento($event: any): void {
        console.log("Valor escrito en el input:", $event.target.value);
    }

    // Cambiamos un booleano para demostrar Class Binding.
    cambiarDestacada(): void {
        this.obraDestacada = !this.obraDestacada;
    }
}
