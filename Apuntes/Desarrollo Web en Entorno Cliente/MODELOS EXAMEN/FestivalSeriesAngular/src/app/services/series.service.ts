import { Service } from "@angular/core";
import { ISerie } from "../interfaces/iserie.interface";

@Service()
export class SeriesService {
    private arrSeries: ISerie[];
    private url: string;
    private cargando: boolean;
    private error: string;

    constructor() {
        this.arrSeries = [];
        this.url = "https://peticiones.online/api/series";
        this.cargando = false;
        this.error = "";
        this.connectSeries();
    }

    // Devuelve la MISMA referencia del array para que otros componentes compartan los datos.
    getAllSeries(): ISerie[] {
        return this.arrSeries;
    }

    isCargando(): boolean {
        return this.cargando;
    }

    getError(): string {
        return this.error;
    }

    // Método público para repetir la petición si el usuario quiere recargar.
    recargarSeries(): void {
        this.arrSeries.splice(0, this.arrSeries.length);
        this.connectSeries();
    }

    private connectSeries(): void {
        this.cargando = true;
        this.error = "";

        fetch(this.url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error HTTP: " + response.status);
                }

                return response.json();
            })
            .then((datos) => {
                datos.forEach((element: any) => {
                    const serie: ISerie = element as ISerie;
                    this.arrSeries.push(serie);
                });
            })
            .catch((error) => {
                this.error = "No se han podido cargar las series: " + error.message;
            })
            .finally(() => {
                this.cargando = false;
            });
    }
}
