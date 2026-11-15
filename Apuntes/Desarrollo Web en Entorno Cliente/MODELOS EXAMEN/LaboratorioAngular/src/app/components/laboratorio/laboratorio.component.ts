import { NgClass, NgStyle } from "@angular/common";
import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CicloVidaComponent } from "../ciclo-vida/ciclo-vida.component";
import { InputSignalComponent } from "../input-signal/input-signal.component";
import { ResaltarDirective } from "../../directives/resaltar.directive";

@Component({
    imports: [
        FormsModule,
        NgClass,
        NgStyle,
        CicloVidaComponent,
        InputSignalComponent,
        ResaltarDirective,
    ],
    selector: "app-laboratorio",
    styleUrl: "./laboratorio.component.css",
    templateUrl: "./laboratorio.component.html",
})
export class LaboratorioComponent {
    /* ================================================================
     * 1. SIGNALS
     * ================================================================ */

    /*
     * signal(0) crea un valor reactivo cuyo valor inicial es 0.
     * Para LEERLO se llama como una función: contadorSignal().
     */
    contadorSignal = signal(0);

    /* ================================================================
     * 2. ngClass y ngStyle
     * ================================================================ */

    activo: boolean;
    tamanoTexto: number;

    /* ================================================================
     * 3. $event e innerHTML
     * ================================================================ */

    textoEvento: string;
    contenidoHtml: string;

    /* ================================================================
     * 4. switch
     * ================================================================ */

    permiso: string;

    /* ================================================================
     * 5. Lifecycle
     * ================================================================ */

    mostrarCicloVida: boolean;
    valorParaHijo: number;

    /* ================================================================
     * 6. Input Signals
     * ================================================================ */

    tituloPanel: string;
    nivelPanel: number;

    constructor() {
        this.activo = false;
        this.tamanoTexto = 16;
        this.textoEvento = "Todavía no has escrito nada";
        this.contenidoHtml =
            "<strong>Texto en negrita</strong><ul><li>Angular</li><li>TypeScript</li></ul>";
        this.permiso = "invitado";
        this.mostrarCicloVida = true;
        this.valorParaHijo = 1;
        this.tituloPanel = "Panel recibido mediante Input Signal";
        this.nivelPanel = 1;
    }

    /* ---------------- SIGNALS ---------------- */

    sumarSignal(): void {
        /*
         * Para cambiar un signal usamos set().
         * Primero leemos el valor actual con contadorSignal().
         */
        this.contadorSignal.set(this.contadorSignal() + 1);
    }

    reiniciarSignal(): void {
        this.contadorSignal.set(0);
    }

    /* ---------------- ngClass / ngStyle ---------------- */

    cambiarActivo(): void {
        this.activo = !this.activo;
    }

    aumentarTexto(): void {
        if (this.tamanoTexto < 30) {
            this.tamanoTexto += 2;
        }
    }

    reducirTexto(): void {
        if (this.tamanoTexto > 10) {
            this.tamanoTexto -= 2;
        }
    }

    /* ---------------- $event ---------------- */

    capturarTexto($event: Event): void {
        /*
         * target es el elemento HTML que ha lanzado el evento.
         * Lo convertimos a HTMLInputElement para poder acceder a .value.
         */
        const input = $event.target as HTMLInputElement;
        this.textoEvento = input.value;
    }

    /* ---------------- switch ---------------- */

    cambiarPermiso(nuevoPermiso: string): void {
        this.permiso = nuevoPermiso;
    }

    /* ---------------- Lifecycle ---------------- */

    cambiarValorHijo(): void {
        this.valorParaHijo++;
    }

    alternarCicloVida(): void {
        /*
         * Al pasar de true a false, el bloque if deja de existir y Angular destruye
         * CicloVidaComponent. En ese momento se ejecuta ngOnDestroy().
         */
        this.mostrarCicloVida = !this.mostrarCicloVida;
    }

    /* ---------------- Input Signals ---------------- */

    aumentarNivelPanel(): void {
        this.nivelPanel++;
    }
}
