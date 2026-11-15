import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ReservaService } from "../../services/reserva.service";
import { UsuarioService } from "../../services/usuario.service";

@Component({
    imports: [],
    selector: "app-resumen",
    styleUrl: "./resumen.css",
    templateUrl: "./resumen.html",
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class Resumen {
    private reservaService = inject(ReservaService);
    private usuarioService = inject(UsuarioService);

    getReservas(): number {
        return this.reservaService.getTotalReservas();
    }

    getEntradas(): number {
        return this.reservaService.getTotalEntradas();
    }

    getUsuarios(): number {
        return this.usuarioService.getAllUsuarios().length;
    }
}
