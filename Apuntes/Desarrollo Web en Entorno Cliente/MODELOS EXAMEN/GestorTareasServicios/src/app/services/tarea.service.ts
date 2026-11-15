import { Service } from "@angular/core";
import { ITarea } from "../interfaces/itarea.interface";

/*
 * El servicio centraliza los datos y las operaciones relacionadas con las tareas.
 *
 * La idea importante es esta:
 * los componentes NO necesitan tener cada uno su propio array de tareas.
 * Todos pueden pedir el mismo servicio mediante inject() y trabajar con los mismos datos.
 *
 * @Service() es el decorador que utiliza el profesor en los ejemplos recientes de Angular 22.
 */
@Service()
export class TareaService {
    // private impide acceder directamente al array desde fuera del servicio.
    // Para consultarlo o modificarlo usaremos métodos del propio servicio.
    private tareas: ITarea[];

    // Guardamos el siguiente id disponible para las nuevas tareas.
    private siguienteId: number;

    constructor() {
        // Datos iniciales para poder ver la aplicación funcionando desde el principio.
        this.tareas = [
            {
                id: 1,
                titulo: "Repasar Angular",
                descripcion: "Revisar Data Binding, Control Flow y formularios.",
                prioridad: "Alta",
                completada: false,
            },
            {
                id: 2,
                titulo: "Subir práctica a GitHub",
                descripcion: "Comprobar los cambios, hacer commit y push.",
                prioridad: "Media",
                completada: true,
            },
            {
                id: 3,
                titulo: "Preparar apuntes",
                descripcion: "Ordenar los modelos de examen por conceptos.",
                prioridad: "Baja",
                completada: false,
            },
        ];

        this.siguienteId = 4;
    }

    // GETTER sencillo: devuelve el mismo array que almacena el servicio.
    // Los componentes que lo reciben estarán consultando los mismos datos compartidos.
    getAllTareas(): ITarea[] {
        return this.tareas;
    }

    // Añade una tarea nueva al array compartido.
    addTarea(tarea: ITarea): void {
        // Comprobaciones básicas por seguridad, aunque el formulario también valida.
        if (tarea == null || tarea.titulo == null || tarea.titulo.trim() === "") {
            return;
        }

        tarea.id = this.siguienteId;
        this.siguienteId++;

        this.tareas.push(tarea);
    }

    // Busca una tarea por id. Puede devolver undefined si no existe.
    getTareaById(id: number): ITarea | undefined {
        return this.tareas.find(function (tarea) {
            return tarea.id === id;
        });
    }

    // Cambia el estado de una tarea: pendiente <-> completada.
    cambiarEstado(id: number): void {
        const tareaEncontrada = this.getTareaById(id);

        if (tareaEncontrada === undefined) {
            return;
        }

        tareaEncontrada.completada = !tareaEncontrada.completada;
    }

    // Elimina una tarea buscando primero su posición dentro del array.
    deleteTarea(id: number): void {
        const indice = this.tareas.findIndex(function (tarea) {
            return tarea.id === id;
        });

        // findIndex devuelve -1 cuando no encuentra el elemento.
        if (indice !== -1) {
            this.tareas.splice(indice, 1);
        }
    }

    // Elimina todas las tareas que estén completadas.
    // Usamos un bucle hacia atrás para poder hacer splice sin saltarnos elementos.
    deleteCompletadas(): void {
        for (let i = this.tareas.length - 1; i >= 0; i--) {
            if (this.tareas[i].completada) {
                this.tareas.splice(i, 1);
            }
        }
    }

    // Métodos auxiliares útiles para el componente de estadísticas.
    getNumeroTareas(): number {
        return this.tareas.length;
    }

    getNumeroCompletadas(): number {
        return this.tareas.filter(function (tarea) {
            return tarea.completada;
        }).length;
    }

    getNumeroPendientes(): number {
        return this.tareas.filter(function (tarea) {
            return !tarea.completada;
        }).length;
    }
}
