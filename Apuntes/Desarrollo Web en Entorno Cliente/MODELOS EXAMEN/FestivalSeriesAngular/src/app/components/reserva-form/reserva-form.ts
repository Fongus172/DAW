import { Component, inject, Input } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { IReserva } from "../../interfaces/ireserva.interface";
import { ISerie } from "../../interfaces/iserie.interface";
import { ReservaService } from "../../services/reserva.service";

@Component({
    imports: [FormsModule],
    selector: "app-reserva-form",
    styleUrl: "./reserva-form.css",
    templateUrl: "./reserva-form.html",
})
export class ReservaForm {
    // El App pasa la serie seleccionada al formulario.
    @Input() serieSeleccionada: ISerie | null;

    private reservaService = inject(ReservaService);
    mensaje: string;

    constructor() {
        this.serieSeleccionada = null;
        this.mensaje = "";
    }

    getDataForm(miFormulario: NgForm): void {
        this.mensaje = "";

        if (this.serieSeleccionada === null) {
            alert("Primero debes seleccionar una serie de la cartelera.");
            return;
        }

        // Si el formulario no es válido, marcamos todos los campos para mostrar errores.
        if (miFormulario.invalid) {
            miFormulario.control.markAllAsTouched();
            return;
        }

        // trim() evita aceptar cadenas que solo contengan espacios.
        const nombre = String(miFormulario.value.nombre ?? "").trim();
        const email = String(miFormulario.value.email ?? "").trim();
        const entradas = Number(miFormulario.value.entradas);
        const turno = String(miFormulario.value.turno ?? "").trim();

        if (nombre === "" || email === "" || turno === "") {
            alert("No se permiten campos de texto vacíos o formados solo por espacios.");
            return;
        }

        if (!Number.isInteger(entradas) || entradas < 1 || entradas > 10) {
            alert("Las entradas deben ser un número entero entre 1 y 10.");
            return;
        }

        const reserva: IReserva = {
            id: -1,
            serieId: this.serieSeleccionada.id,
            serieTitulo: this.serieSeleccionada.title,
            nombre: nombre,
            email: email,
            entradas: entradas,
            turno: turno,
        };

        const insertada = this.reservaService.addReserva(reserva);

        if (insertada) {
            this.mensaje = "Reserva realizada correctamente.";
            miFormulario.resetForm();
        }
    }
}
