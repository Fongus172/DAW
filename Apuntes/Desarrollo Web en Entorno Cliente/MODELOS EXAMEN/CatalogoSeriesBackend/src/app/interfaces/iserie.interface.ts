// Interfaz que describe exactamente los datos que tiene una serie.
// Los nombres coinciden con las propiedades que devuelve la API usada por el profesor.
export interface ISerie {
    // _id lo proporciona la API. Es opcional porque una serie añadida localmente no lo tendrá.
    _id?: string;
    id: number;
    title: string;
    creator: string;
    rating: number;
    dates: string;
    image: string;
    channel: string;
}
