import { Service } from "@angular/core";
import { ISerie } from "../interfaces/iserie.interface";

// @Service() es el decorador que está utilizando el profesor con Angular 22.
// El servicio centraliza los datos para que varios componentes puedan compartirlos.
@Service()
export class SeriesServices {
    // Array compartido por todos los componentes que inyecten este servicio.
    private arrSeries: ISerie[];

    // MISMA API que utiliza el ejemplo SeriesFetchApp del profesor.
    private url: string = "https://peticiones.online/api/series";

    // ID para las series que añadamos SOLO de forma local.
    // Empieza alto para evitar chocar con los IDs que llegan de la API.
    private id: number;

    // Propiedades sencillas para informar a la interfaz del estado de la petición.
    private cargando: boolean;
    private error: string;

    constructor() {
        this.arrSeries = [];
        this.id = 1000;
        this.cargando = false;
        this.error = "";

        // Al crear el servicio pedimos automáticamente las series al backend/API.
        this.connectSeries();
    }

    // Devuelve LA MISMA referencia del array.
    // Esto permite que los componentes vean los cambios realizados sobre él.
    getAllSeries(): ISerie[] {
        return this.arrSeries;
    }

    getCargando(): boolean {
        return this.cargando;
    }

    getError(): string {
        return this.error;
    }

    // Realiza la petición GET con fetch.
    // Este es el patrón central de este proyecto.
    connectSeries(): void {
        this.cargando = true;
        this.error = "";

        // Vaciamos el array SIN sustituirlo por otro nuevo.
        // splice mantiene la misma referencia que ya tienen los componentes.
        this.arrSeries.splice(0, this.arrSeries.length);

        fetch(this.url)
            .then((response) => {
                // fetch solo entra en catch ante ciertos errores de red.
                // Por eso comprobamos también response.ok para detectar 404, 500, etc.
                if (!response.ok) {
                    throw new Error("Error HTTP: " + response.status);
                }

                // Convertimos la respuesta del servidor de JSON a JavaScript.
                return response.json();
            })
            .then((datos) => {
                // La API del profesor devuelve directamente un array de series.
                if (!Array.isArray(datos)) {
                    throw new Error("La respuesta del backend no es un array.");
                }

                datos.forEach((element: any) => {
                    const serie: ISerie = element as ISerie;
                    this.arrSeries.push(serie);
                });
            })
            .catch((error) => {
                // Guardamos un mensaje sencillo para poder mostrarlo en el HTML.
                this.error = "No se han podido cargar las series: " + error.message;
            })
            .finally(() => {
                // finally se ejecuta tanto si la petición funciona como si falla.
                this.cargando = false;
            });
    }

    // Añade una serie SOLO al array del frontend.
    // IMPORTANTE: esto NO hace un POST al servidor.
    // Es el mismo enfoque que utiliza SeriesFetchApp del profesor.
    addSerie(serie: ISerie): void {
        if (serie == null) {
            return;
        }

        // Comprobación sencilla para evitar títulos repetidos ignorando mayúsculas/minúsculas.
        const serieRepetida = this.arrSeries.find(function (serieArray) {
            return serieArray.title.toLowerCase() === serie.title.toLowerCase();
        });

        if (serieRepetida !== undefined) {
            alert("Ya existe una serie con ese título.");
            return;
        }

        serie.id = this.id;
        this.id++;
        this.arrSeries.push(serie);
    }

    // Elimina una serie SOLO del array local.
    // Tampoco realiza una petición DELETE al backend.
    deleteSerieById(id: number): void {
        const indice = this.arrSeries.findIndex(function (serie) {
            return serie.id === id;
        });

        // findIndex devuelve -1 cuando no encuentra el elemento.
        if (indice !== -1) {
            this.arrSeries.splice(indice, 1);
        }
    }
}
