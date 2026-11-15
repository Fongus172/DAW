import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ISerie } from "../../interfaces/iserie.interface";
import { SeriesServices } from "../../services/series-services";

@Component({
    imports: [ReactiveFormsModule],
    selector: "app-serie-form",
    styleUrl: "./serie-form.css",
    templateUrl: "./serie-form.html",
})
export class SerieForm {
    // Reactive Form, siguiendo el mismo patrón que el ejemplo del profesor.
    serieForm: FormGroup;

    // inject() nos da acceso a la MISMA instancia del servicio compartido.
    private seriesService = inject(SeriesServices);

    constructor() {
        this.serieForm = new FormGroup({
            id: new FormControl(null),
            title: new FormControl(null, [Validators.required]),
            creator: new FormControl(null, [Validators.required]),
            rating: new FormControl(null, [
                Validators.required,
                Validators.min(0),
                Validators.max(10),
            ]),
            dates: new FormControl(null, [Validators.required]),
            image: new FormControl(null, [Validators.required]),
            channel: new FormControl(null, [Validators.required]),
        });
    }

    getDataForm(): void {
        // Aunque el botón esté disabled, esta comprobación protege también el TypeScript.
        if (this.serieForm.invalid) {
            this.serieForm.markAllAsTouched();
            return;
        }

        // Convertimos el objeto del formulario a nuestra interfaz.
        const serie: ISerie = this.serieForm.value as ISerie;

        // El servicio asignará el ID local definitivo.
        serie.id = -1;

        this.seriesService.addSerie(serie);

        // Limpiamos todos los controles después de guardar.
        this.serieForm.reset();
    }

    // Método auxiliar para mostrar errores únicamente cuando corresponde.
    checkControl(nombreControl: string, nombreError: string): boolean {
        const control = this.serieForm.get(nombreControl);

        if (control === null) {
            return false;
        }

        return control.hasError(nombreError) && control.touched;
    }
}
