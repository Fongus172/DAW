import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InventarioExamenComponent } from './components/inventario-examen/inventario-examen.component';
import { ProductFilter } from './components/product-filter/product-filter.component';
import { ProductForm } from './components/product-form/product-form.component';
import { ProductsList } from './components/products-list/products-list.component';

@Component({
  imports: [RouterOutlet, InventarioExamenComponent, ProductFilter, ProductForm, ProductsList],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('ivanMarinExamenAngular');
}
