import { Component } from "@angular/core";
import { LibroCardComponent } from "./components/libro-card/libro-card.component";
import { LibroDetalleComponent } from "./components/libro-detalle/libro-detalle.component";
import { ILibro } from "./interfaces/ilibro.interface";

@Component({
    // Como son componentes standalone, los hijos se importan directamente aquí.
    imports: [LibroCardComponent, LibroDetalleComponent],
    selector: "app-root",
    styleUrl: "./app.css",
    templateUrl: "./app.html",
})
export class App {
    libros: ILibro[];
    libroSeleccionado: ILibro | undefined;
    ultimoEvento: string;

    constructor() {
        // El PADRE es quien posee los datos y quien decide cómo modificarlos.
        this.libros = [
            {
                id: 1,
                titulo: "1984",
                autor: "George Orwell",
                genero: "Distopía",
                paginas: 328,
                disponible: true,
            },
            {
                id: 2,
                titulo: "El Hobbit",
                autor: "J. R. R. Tolkien",
                genero: "Fantasía",
                paginas: 310,
                disponible: false,
            },
            {
                id: 3,
                titulo: "Don Quijote de la Mancha",
                autor: "Miguel de Cervantes",
                genero: "Novela",
                paginas: 863,
                disponible: true,
            },
            {
                id: 4,
                titulo: "Frankenstein",
                autor: "Mary Shelley",
                genero: "Terror / Ciencia ficción",
                paginas: 280,
                disponible: true,
            },
        ];

        this.libroSeleccionado = undefined;
        this.ultimoEvento = "Todavía no se ha recibido ningún evento de un componente hijo.";
    }

    seleccionarLibro($event: number): void {
        /*
         * $event contiene exactamente el valor que el hijo ha enviado con emit().
         * En este proyecto es el id del libro.
         */
        const libroEncontrado = this.libros.find(function (libro) {
            return libro.id === $event;
        });

        this.libroSeleccionado = libroEncontrado;

        if (libroEncontrado !== undefined) {
            this.ultimoEvento = `El hijo ha pedido mostrar: ${libroEncontrado.titulo}`;
        }
    }

    cambiarDisponibilidad($event: number): void {
        const libroEncontrado = this.libros.find(function (libro) {
            return libro.id === $event;
        });

        if (libroEncontrado === undefined) {
            return;
        }

        // La modificación real se realiza en el PADRE.
        libroEncontrado.disponible = !libroEncontrado.disponible;

        this.ultimoEvento = `El hijo ha pedido cambiar el estado de: ${libroEncontrado.titulo}`;

        // Si era el libro mostrado en detalle, el objeto es el mismo y refleja el cambio.
    }

    eliminarLibro($event: number): void {
        const indice = this.libros.findIndex(function (libro) {
            return libro.id === $event;
        });

        if (indice === -1) {
            return;
        }

        const tituloEliminado = this.libros[indice].titulo;

        // splice(indice, 1) elimina un elemento del array en esa posición.
        this.libros.splice(indice, 1);

        // Si eliminamos el libro que estaba abierto, cerramos también su detalle.
        if (this.libroSeleccionado?.id === $event) {
            this.libroSeleccionado = undefined;
        }

        this.ultimoEvento = `El hijo ha pedido eliminar: ${tituloEliminado}`;
    }

    cerrarDetalle(): void {
        this.libroSeleccionado = undefined;
        this.ultimoEvento = "El componente de detalle ha avisado al padre para cerrarse.";
    }

    restaurarLibros(): void {
        // Método auxiliar para poder seguir probando el proyecto después de eliminar libros.
        this.libros = [
            {
                id: 1,
                titulo: "1984",
                autor: "George Orwell",
                genero: "Distopía",
                paginas: 328,
                disponible: true,
            },
            {
                id: 2,
                titulo: "El Hobbit",
                autor: "J. R. R. Tolkien",
                genero: "Fantasía",
                paginas: 310,
                disponible: false,
            },
            {
                id: 3,
                titulo: "Don Quijote de la Mancha",
                autor: "Miguel de Cervantes",
                genero: "Novela",
                paginas: 863,
                disponible: true,
            },
            {
                id: 4,
                titulo: "Frankenstein",
                autor: "Mary Shelley",
                genero: "Terror / Ciencia ficción",
                paginas: 280,
                disponible: true,
            },
        ];

        this.libroSeleccionado = undefined;
        this.ultimoEvento = "Se ha restaurado el array inicial desde el componente padre.";
    }
}
