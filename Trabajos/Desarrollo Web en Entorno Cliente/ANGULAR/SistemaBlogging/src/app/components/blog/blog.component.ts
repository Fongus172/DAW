import { Component } from "@angular/core";
import { INoticia } from "../../interfaces/inoticia.interface";
import { FormsModule } from "@angular/forms";

@Component({
    imports: [FormsModule],
    selector: "app-blog",
    styleUrl: "./blog.component.css",
    templateUrl: "./blog.component.html",
})
export class BlogComponent {
    noticias: INoticia[];
    titulo: string;
    imagen: string;
    texto: string;
    fecha: string;

    constructor() {
        this.noticias = [
            {
                titulo: "Primera dimensión en 14 años",
                imagen: "https://minecraft.wiki/images/thumb/The_Sift.png/1200px-The_Sift.png?f60b8",
                texto: "Mojang ha anunciado el Sift, la 4ª dimensión de Minecraft, siendo esta la primera nueva dimensión en más de 14 años desde la introducción del End.",
                fecha: "2026-09-26",
            },
            {
                titulo: "El jefe de Sonic Team, Takashi Iizuka, relevó que la franquicia de Sonic estuvo a punto de descontinuarse",
                imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiSAoscHtmbBxplgAOITL5f11Wijd7kNCdNCMxpwSQM0wPkvZnuCQo53GS&s=10",
                texto: "'Como el Leganés no pase a primera división, cancelamos la franquicia entera.'",
                fecha: "2026-08-02",
            },
        ];
        this.titulo = "";
        this.imagen = "";
        this.texto = "";
        this.fecha = "";
    }

    publicarNoticia() {
        if (
            this.titulo.trim() == "" ||
            this.imagen.trim() == "" ||
            this.texto.trim() == "" ||
            this.fecha == ""
        ) {
            alert("Todos los campos son obligatorios");
            return;
        }

        const nuevaNoticia: INoticia = {
            titulo: this.titulo,
            imagen: this.imagen,
            texto: this.texto,
            fecha: this.fecha,
        };

        this.noticias.push(nuevaNoticia);

        this.titulo = "";
        this.imagen = "";
        this.texto = "";
        this.fecha = "";
    }
}
