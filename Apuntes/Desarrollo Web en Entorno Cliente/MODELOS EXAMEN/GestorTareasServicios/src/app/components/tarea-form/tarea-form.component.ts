import { Component, inject } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { ITarea } from "../../interfaces/itarea.interface";
import { TareaService } from "../../services/tarea.service";

@Component({
    selector: "app-tarea-form",
    // FormsModule es necesario porque este componente utiliza un formulario Template.
    imports: [FormsModule],
    templateUrl: "./tarea-form.component.html",
    styleUrl: "./tarea-form.component.css",
})
export class TareaFormComponent {
    /*
     * inject() pide a Angular una instancia del servicio.
     * Otro componente que inyecte TareaService trabajará con el MISMO servicio y los mismos datos.
     */
    private tareaService = inject(TareaService);

    getDataForm(formTarea: NgForm): void {
        // Si el formulario no es válido, marcamos sus campos para mostrar los errores.
        if (formTarea.invalid) {
            formTarea.control.markAllAsTouched();
            return;
        }

        // El value del formulario es un objeto cuyas claves son los name de los inputs.
        const datosFormulario = formTarea.value;

        // Comprobación adicional para impedir títulos que sean solo espacios.
        if (datosFormulario.titulo == null || datosFormulario.titulo.trim() === "") {
            alert("El título no puede estar vacío ni contener solamente espacios.");
            return;
        }

        const nuevaTarea: ITarea = {
            // El servicio sustituirá este -1 por el id correcto.
            id: -1,
            titulo: datosFormulario.titulo.trim(),
            descripcion:
                datosFormulario.descripcion == null ? "" : datosFormulario.descripcion.trim(),
            prioridad: datosFormulario.prioridad,
            completada: false,
        };

        // El componente no hace push directamente. Delega esa responsabilidad al servicio.
        this.tareaService.addTarea(nuevaTarea);

        // Limpiamos el formulario y sus estados touched/dirty después de insertar.
        formTarea.resetForm({ prioridad: "Media" });
    }
}
