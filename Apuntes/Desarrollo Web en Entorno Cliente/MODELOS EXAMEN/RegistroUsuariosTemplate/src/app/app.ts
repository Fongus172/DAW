import { Component } from '@angular/core';
import { RegistroUsuariosComponent } from './components/registro-usuarios/registro-usuarios.component';

@Component({
    // El componente principal solo carga nuestro componente de ejemplo.
    imports: [RegistroUsuariosComponent],
    selector: 'app-root',
    styleUrl: './app.css',
    templateUrl: './app.html',
})
export class App {}
