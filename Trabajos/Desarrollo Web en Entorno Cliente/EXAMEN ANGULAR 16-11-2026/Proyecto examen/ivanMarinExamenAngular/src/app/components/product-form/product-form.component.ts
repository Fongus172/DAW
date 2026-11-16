import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IProduct } from '../../interfaces/iproduct.interfaces';
import { IProductFilter } from '../../interfaces/iproduct-filter.interfaces';
import { ProductService } from '../../services/product-service.services';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-product-form',
  styleUrl: './product-form.component.css',
  templateUrl: './product-form.component.html',
})
export class ProductForm {
  productForm: FormGroup;
  message: string;
  messageType: string;

  private productService = inject(ProductService);

  constructor() {
    this.message = '';
    this.messageType = '';

    this.productForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      description: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      price: new FormControl(null, [Validators.required, Validators.min(0.01)]),
      category: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required, Validators.pattern('https?://.+')]),
      active: new FormControl(true, [Validators.required]),
    });
  }

  getDataForm(): void {
    this.message = '';
    this.messageType = '';

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const product: IProduct = {
      id: 'local-' + Date.now().toString(),
      name: String(this.productForm.value.name ?? '').trim(),
      description: String(this.productForm.value.description ?? '').trim(),
      price: Number(this.productForm.value.price),
      category: String(this.productForm.value.category ?? ''),
      image: String(this.productForm.value.image ?? '').trim(),
      active: Boolean(this.productForm.value.active),
    };

    if (
      product.name === '' ||
      product.description === '' ||
      !Number.isFinite(product.price) ||
      product.price <= 0 ||
      product.category === '' ||
      product.image === ''
    ) {
      this.message = 'Revisa los datos del formulario';
      this.messageType = 'danger';
      return;
    }

    const added = this.productService.addProduct(product);

    if (!added) {
      this.message = 'Ya existe un producto con ese nombre';
      this.messageType = 'danger';
      return;
    }

    this.message = 'Producto añadido a la lista correctamente';
    this.messageType = 'success';

    this.productForm.reset({
      name: '',
      description: '',
      price: null,
      category: '',
      image: '',
      active: true,
    });
  }

  checkControl(controlName: string, errorName: string): boolean {
    const control = this.productForm.get(controlName);

    if (control === null) {
      return false;
    }

    return control.hasError(errorName) && control.touched;
  }
}
