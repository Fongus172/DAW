import { Directive, ElementRef } from "@angular/core";

@Directive({
    selector: "[resaltar]",
})
export class ResaltarDirective {
    constructor(elemento: ElementRef) {
        /*
         * ElementRef nos da acceso al elemento del DOM sobre el que hemos colocado
         * la directiva. Este es el patrón sencillo que aparece en el Tema 6.
         *
         * Al escribir <p resaltar>...</p>, este constructor se ejecuta sobre ese <p>.
         */
        elemento.nativeElement.style.backgroundColor = "#fff3cd";
        elemento.nativeElement.style.border = "1px solid #ffda6a";
        elemento.nativeElement.style.padding = "12px";
        elemento.nativeElement.style.borderRadius = "8px";
    }
}
