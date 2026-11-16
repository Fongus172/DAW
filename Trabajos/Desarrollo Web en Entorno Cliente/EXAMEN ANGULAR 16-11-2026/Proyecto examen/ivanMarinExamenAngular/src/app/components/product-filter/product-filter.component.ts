import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IProductFilter } from '../../interfaces/iproduct-filter.interfaces';
import { ProductService } from '../../services/product-service.services';

@Component({
  imports: [FormsModule],
  selector: 'app-product-filter',
  styleUrl: './product-filter.component.css',
  templateUrl: './product-filter.component.html',
})
export class ProductFilter {
  filters: IProductFilter;

  private productService = inject(ProductService);

  constructor() {
    this.filters = {
      name: '',
      category: '',
      price: null,
      active: 'all',
    };
  }

  /*getDataForm(filterForm: NgForm){
    if()
  }*/

  getDataForm(filterForm: NgForm): void {
    if (filterForm.invalid) {
      return;
    }

    this.productService.applyFilters(this.filters);
  }

  clearFilter(filterForm: NgForm): void {
    this.filters = {
      name: '',
      category: '',
      price: null,
      active: 'all',
    };

    filterForm.resetForm(this.filters);
    this.productService.clearFilters();
  }
}
