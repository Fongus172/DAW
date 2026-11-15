// Esta interfaz define cómo debe ser un usuario guardado en nuestra aplicación.
// La usamos para evitar objetos con propiedades mal escritas o tipos incorrectos.
export interface IUsuario {
    nombre: string;
    apellidos: string;
    usuario: string;
    email: string;
    dni: string;
    edad: number;
    telefono: string;
    password: string;
    provincia: string;
    aceptaCondiciones: boolean;
}
