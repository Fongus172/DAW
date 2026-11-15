// Esta interfaz define la forma que tendrá cada obra del museo.
// Usar interfaces nos ayuda a que todos los objetos tengan siempre las mismas propiedades.
export interface IObra {
    id: number;
    titulo: string;
    autor: string;
    anio: number;
    sala: string;
}
