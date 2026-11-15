import { Component } from "@angular/core";
import { SerieForm } from "./components/serie-form/serie-form";
import { SerieList } from "./components/serie-list/serie-list";

@Component({
    imports: [SerieForm, SerieList],
    selector: "app-root",
    styleUrl: "./app.css",
    templateUrl: "./app.html",
})
export class App {}
