import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { IReserva } from "../../interfaces/ireserva.interface";
import { ReservaService } from "../../services/reserva.service";

@Component({
    imports: [],
    selector: "app-reserva-list",
    styleUrl: "./reserva-list.css",
    templateUrl: "./reserva-list.html",
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class ReservaList {
    reservas: IReserva[];
    private reservaService = inject(ReservaService);

    constructor() {
        this.reservas = [];
    }

    ngOnInit(): void {
        this.reservas = this.reservaService.getAllReservas();
    }

    sumarEntrada(id: number): void {
        const reserva = this.reservas.find(function (reserva) {
            return reserva.id === id;
        });

        if (reserva !== undefined && reserva.entradas < 10) {
            this.reservaService.cambiarEntradas(id, reserva.entradas + 1);
        }
    }

    restarEntrada(id: number): void {
        const reserva = this.reservas.find(function (reserva) {
            return reserva.id === id;
        });

        if (reserva !== undefined) {
            this.reservaService.cambiarEntradas(id, reserva.entradas - 1);
        }
    }

    eliminar(id: number): void {
        this.reservaService.deleteReserva(id);
    }
}
