// Interfaz basada en la respuesta real de la API usada por el profesor.
export interface ISerie {
    _id?: string;
    id: number;
    title: string;
    creator: string;
    rating: number;
    dates: string;
    image: string;
    channel: string;
}
