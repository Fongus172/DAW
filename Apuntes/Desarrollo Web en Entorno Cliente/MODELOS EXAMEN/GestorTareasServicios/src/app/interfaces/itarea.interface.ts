// Una interfaz define la forma que deben tener los objetos de tipo tarea.
// Así TypeScript puede avisarnos si olvidamos una propiedad o usamos un tipo incorrecto.
export interface ITarea {
    id: number;
    titulo: string;
    descripcion: string;
    prioridad: string;
    completada: boolean;
}
