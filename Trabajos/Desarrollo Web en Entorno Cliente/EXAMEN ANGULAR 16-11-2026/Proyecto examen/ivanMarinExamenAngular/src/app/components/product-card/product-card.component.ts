import { ProductService } from './../../services/product-service.services';
import { Component, inject, Input } from '@angular/core';
import { IProduct } from '../../interfaces/iproduct.interfaces';
import { IProductFilter } from '../../interfaces/iproduct-filter.interfaces';

@Component({
  imports: [],
  selector: 'app-product-card',
  styleUrl: './product-card.component.css',
  templateUrl: './product-card.component.html',
})
export class ProductCard {
  @Input() miProducto: IProduct;

  private productService = inject(ProductService);

  constructor() {
    this.miProducto = {
      id: '',
      name: '',
      description: '',
      price: 0,
      category: '',
      image: '',
      active: false,
    };
  }

  deleteProduct(): void {
    this.productService.deleteProductById(this.miProducto.id);
  }
}
