import { Component, ViewChild } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ProductComponent } from '../product/product.component';
import { Product, Products } from '../../../types';
import { CommonModule } from '@angular/common';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../../environments/environment.development';
import { EditPopupComponent } from "../edit-popup/edit-popup.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductComponent, CommonModule, PaginatorModule, EditPopupComponent, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private productsService: ProductsService) {}

  apiUrl: String = environment.API_URL;

  @ViewChild('paginator') paginator: Paginator | undefined;

  products: Product[] = [];

  /* ADD/EDIT Popup */
  selectedProduct: Product = {
    name: '',
    image: '',
    price: '',
    rating: 0
  }

  displayAddProduct: boolean = false;
  displayEditProduct: boolean = false;

  toggleAddPopup() {
    this.displayAddProduct = true;
  }

  toggleEditPopup(product: Product) {
    this.selectedProduct = product;
    this.displayEditProduct = true;
  }

  toggleDeletePopup(product: Product) {
    if (!product._id) return;
    this.deleteProduct(product._id);
  }
  
  onConfirmAdd(product: Product) {
    this.addProduct(product);
    this.displayAddProduct = false;
  }

  onConfirmEdit(product: Product) {
    if (!this.selectedProduct._id) return;

    this.editProduct(product, this.selectedProduct._id);
    this.displayAddProduct = false;
  }

  /* Paginator */
  totalRecords: number = 0;
  rows: number = 5;

  onPageChange(event: any) {
    this.fetchProducts(event.page, event.rows);
  }

  resetPaginator() {
    this.paginator?.changePage(0);
  }

  /* GET Product */
  fetchProducts(page:number, perPage:number) {
    this.productsService
      .getProducts(`${this.apiUrl}/products`, { page, perPage })
      .subscribe({
        next: (data: Products) => {
          this.products = data.items;
          this.totalRecords = data.total;
          console.log(data);
        },
        error: error => console.log(error)
      })
  }

  /* CREATE Product */
  addProduct(product: Product) {
    this.productsService.addProduct(`${this.apiUrl}/products/`, product).subscribe(
      {
        next: data => {
          console.log(data)
          this.fetchProducts(0,this.rows);
          this.resetPaginator();
        },
        error: error => console.log(error)
      }
    )
  }

  /* PUT Product */
  editProduct(product: Product, id: number) {
    this.productsService.editProduct(`${this.apiUrl}/products/${id}`, product).subscribe(
      {
        next: data => {
          console.log(data)
          this.fetchProducts(0,this.rows);
          this.resetPaginator();
        },
        error: error => console.log(error)
      }
    )
  }

  /* DELETE Product */
  deleteProduct(id: number) {
    this.productsService.deleteProduct(`${this.apiUrl}/products/${id}`).subscribe(
      {
        next: data => {
          console.log(data)
          this.fetchProducts(0,this.rows);
          this.resetPaginator();
        },
        error: error => console.log(error)
      }
    )
  }

  ngOnInit() {
    this.fetchProducts(0,this.rows);
  }
}
