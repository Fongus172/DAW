// La interfaz define qué datos debe tener SIEMPRE un libro.
// Es el mismo patrón que usa el profesor con interfaces como Ideporte.
export interface ILibro {
    id: number;
    titulo: string;
    autor: string;
    genero: string;
    paginas: number;
    disponible: boolean;
}
