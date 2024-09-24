import { Component } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ProductComponent } from '../product/product.component';
import { Product, Products } from '../../../types';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductComponent, CommonModule, PaginatorModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private productsService: ProductsService) {}

  apiUrl: String = environment.API_URL;

  products: Product[] = [];

  totalRecords: number = 0;
  rows: number = 5;

  onPageChange(event: any) {
    this.fetchProducts(event.page, event.rows);
  }

  fetchProducts(page:number, perPage:number) {
    this.productsService
      .getProducts(`${this.apiUrl}/clothes`, { page, perPage })
      .subscribe({
        next: (data: Products) => {
          this.products = data.items;
          this.totalRecords = data.total;
        },
        error: error => console.log(error)
      })
  }

  editProduct(product: Product, id: number) {
    this.productsService.editProduct(`${this.apiUrl}/clothes/${id}`, product).subscribe(
      {
        next: data => {
          console.log(data)
          this.fetchProducts(0,this.rows);
        },
        error: error => console.log(error)
      }
    )
  }

  addProduct(product: Product) {
    this.productsService.addProduct(`${this.apiUrl}/clothes/`, product).subscribe(
      {
        next: data => {
          console.log(data)
          this.fetchProducts(0,this.rows);
        },
        error: error => console.log(error)
      }
    )
  }

  deleteProduct(id: number) {
    this.productsService.deleteProduct(`${this.apiUrl}/clothes/${id}`).subscribe(
      {
        next: data => {
          console.log(data)
          this.fetchProducts(0,this.rows);
        },
        error: error => console.log(error)
      }
    )
  }

  ngOnInit() {
    this.fetchProducts(0,this.rows);
  }
}
