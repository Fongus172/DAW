import { Service } from '@angular/core';
import { IProduct } from '../interfaces/iproduct.interfaces';
import { IProductFilter } from '../interfaces/iproduct-filter.interfaces';

@Service()
export class ProductService {
  private products: IProduct[];
  private filteredProducts: IProduct[];
  private url: string;
  private loading: boolean;
  private error: string;

  private currentFilters: IProductFilter;

  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.url = 'http://localhost:8080/api/products';
    this.loading = false;
    this.error = '';
    this.currentFilters = {
      name: '',
      category: '',
      price: null,
      active: 'all',
    };

    this.connectProducts();
  }

  getAllProducts(): IProduct[] {
    return this.filteredProducts;
  }

  getLoading(): boolean {
    return this.loading;
  }

  getError(): string {
    return this.error;
  }

  getTotalProducts(): number {
    return this.products.length;
  }

  connectProducts(): void {
    this.loading = true;
    this.error = '';

    this.products.splice(0, this.products.length);
    this.filteredProducts.splice(0, this.filteredProducts.length);

    fetch(this.url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error HTTP: ' + response.status);
        }

        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error('ERROR. La respuesta de la API no es una lsita de productos');   //devolver errro
        }

        data.forEach((element: any) => {
          const product: IProduct = element as IProduct;
          this.products.push(product);
        });

        this.applyFilters(this.currentFilters);
      })
      .catch((error) => {
        this.error = 'Error al cargar los productos: ' + error.message;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  addProduct(product: IProduct): boolean {
    if (product == null) {
      return false;
    }

    const repeatedProduct = this.products.find(function (productArray) {
      return productArray.name.toLowerCase() === product.name.toLowerCase();
    });

    if (repeatedProduct !== undefined) {
      return false;
    }

    this.products.push(product);
    this.applyFilters(this.currentFilters);
    return true;
  }

  deleteProductById(id: string): void {
    const index = this.products.findIndex(function (product) {
      return product.id === id;
    });

    if (index !== -1) {
      this.products.splice(index, 1);
      this.applyFilters(this.currentFilters);
    }
  }

  applyFilters(filters: IProductFilter): void {
    this.currentFilters = {
      name: filters.name,
      category: filters.category,
      price: filters.price,
      active: filters.active,
    };

    const filtered = this.products.filter((product) => {
      const nameOk = product.name.toLowerCase().includes(filters.name.trim().toLowerCase());

      const categoryOk = filters.category === '' || product.category === filters.category;

      const priceOk = filters.price === null || product.price <= filters.price;

      let activeOk = true;
      if (filters.active === 'true') {
        activeOk = product.active === true;
      } else if (filters.active === 'false') {
        activeOk = product.active === false;
      }

      return nameOk && categoryOk && priceOk && activeOk;
    });


    this.filteredProducts.splice(0, this.filteredProducts.length);
    filtered.forEach((product) => {
      this.filteredProducts.push(product);
    });
  }

  clearFilters(): void {
    this.applyFilters({
      name: '',
      category: '',
      price: null,
      active: 'all',
    });
  }
}
