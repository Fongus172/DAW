// La interfaz define la forma que tendrá cada alumno del array.
// Si el examen fuese de productos, libros, clientes, etc., esta sería una de las primeras cosas que cambiaríamos.
export interface IAlumno {
    id: number;
    nombre: string;
    apellidos: string;
    edad: number;
    curso: string;
    email: string;
    nota: number;
}
