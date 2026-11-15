import {
    AfterContentChecked,
    AfterContentInit,
    AfterViewChecked,
    AfterViewInit,
    Component,
    DoCheck,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from "@angular/core";

@Component({
    imports: [],
    selector: "app-ciclo-vida",
    styleUrl: "./ciclo-vida.component.css",
    templateUrl: "./ciclo-vida.component.html",
})
export class CicloVidaComponent
    implements
        OnChanges,
        OnInit,
        DoCheck,
        AfterContentInit,
        AfterContentChecked,
        AfterViewInit,
        AfterViewChecked,
        OnDestroy
{
    /*
     * Este Input sirve para provocar cambios desde el componente padre y poder
     * observar cuándo se ejecuta ngOnChanges().
     */
    @Input() valorRecibido: number;

    /* Contador visible que nos permite comprobar que el componente sigue vivo. */
    contadorLocal: number;

    constructor() {
        this.valorRecibido = 0;
        this.contadorLocal = 0;

        // El constructor se ejecuta al crear la instancia de la clase.
        console.log("1. constructor - CicloVidaComponent");
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Se ejecuta cuando cambia un valor recibido mediante Input.
        console.log("2. ngOnChanges", changes);
    }

    ngOnInit(): void {
        /*
         * Hook más importante en los ejemplos prácticos del profesor.
         * En PrimeraAppAngular aparece indicado como lugar ideal para pedir datos
         * al backend.
         */
        console.log("3. ngOnInit");
    }

    ngDoCheck(): void {
        // Se ejecuta durante las comprobaciones de cambios de Angular.
        console.log("4. ngDoCheck");
    }

    ngAfterContentInit(): void {
        console.log("5. ngAfterContentInit");
    }

    ngAfterContentChecked(): void {
        console.log("6. ngAfterContentChecked");
    }

    ngAfterViewInit(): void {
        console.log("7. ngAfterViewInit");
    }

    ngAfterViewChecked(): void {
        console.log("8. ngAfterViewChecked");
    }

    ngOnDestroy(): void {
        /*
         * Se ejecuta justo antes de destruir el componente.
         * Puedes verlo al pulsar "Ocultar componente" en el padre.
         */
        console.log("9. ngOnDestroy - el componente va a desaparecer");
    }

    sumarContador(): void {
        this.contadorLocal++;
    }
}
