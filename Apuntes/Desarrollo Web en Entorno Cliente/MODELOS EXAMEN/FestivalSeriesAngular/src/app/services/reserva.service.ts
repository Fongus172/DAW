import { Service } from "@angular/core";
import { IReserva } from "../interfaces/ireserva.interface";

@Service()
export class ReservaService {
    private reservas: IReserva[];
    private siguienteId: number;

    constructor() {
        this.reservas = [];
        this.siguienteId = 1;
    }

    getAllReservas(): IReserva[] {
        return this.reservas;
    }

    addReserva(reserva: IReserva): boolean {
        // Comprobación adicional en el servicio para evitar datos absurdos.
        if (reserva == null || reserva.entradas <= 0) {
            return false;
        }

        reserva.id = this.siguienteId;
        this.siguienteId++;
        this.reservas.push(reserva);
        return true;
    }

    deleteReserva(id: number): void {
        const indice = this.reservas.findIndex(function (reserva) {
            return reserva.id === id;
        });

        if (indice !== -1) {
            this.reservas.splice(indice, 1);
        }
    }

    cambiarEntradas(id: number, cantidad: number): void {
        const reserva = this.reservas.find(function (reserva) {
            return reserva.id === id;
        });

        if (reserva === undefined) {
            return;
        }

        if (cantidad <= 0) {
            this.deleteReserva(id);
            return;
        }

        if (cantidad > 10) {
            return;
        }

        reserva.entradas = cantidad;
    }

    getTotalReservas(): number {
        return this.reservas.length;
    }

    getTotalEntradas(): number {
        let total = 0;

        this.reservas.forEach(function (reserva) {
            total += reserva.entradas;
        });

        return total;
    }
}
