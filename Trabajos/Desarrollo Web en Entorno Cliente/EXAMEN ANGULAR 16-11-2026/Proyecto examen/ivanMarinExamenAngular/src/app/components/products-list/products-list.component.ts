import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IProduct } from '../../interfaces/iproduct.interfaces';
import { ProductService } from '../../services/product-service.services';
import { ProductCard } from '../product-card/product-card.component';

@Component({
  imports: [ProductCard],
  selector: 'app-products-list',
  styleUrl: './products-list.component.css',
  templateUrl: './products-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ProductsList {
  productsArray: IProduct[];

  private productService = inject(ProductService);

  constructor() {
    this.productsArray = [];
  }

  ngOnInit(): void {
    this.productsArray = this.productService.getAllProducts();
  }

  isLoading(): boolean {
    return this.productService.getLoading();
  }

  getError(): string {
    return this.productService.getError();
  }

  getTotalProducts(): number {
    return this.productService.getTotalProducts();
  }

  reloadProducts(): void {
    this.productService.connectProducts();
  }
}
