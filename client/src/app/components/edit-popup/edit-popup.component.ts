import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Product } from '../../../types';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-edit-popup',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule,
    ButtonModule,
    FormsModule,
    RatingModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-popup.component.html',
  styleUrl: './edit-popup.component.scss',
})
export class EditPopupComponent {
  @Input() display: boolean = false;
  @Input() header!: string;
  @Input() product: Product = {
    name: '',
    image: '',
    price: '',
    rating: 0,
  };
  @Output() confirm = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();
  @Output() displayChange = new EventEmitter<boolean>();

  // Form Group
  productForm!: FormGroup;

  // Custom validator to check for special characters in the name field
  specialCharValidator(): ValidatorFn {
    return (control) => {
      const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
        control.value
      );

      return hasSpecialCharacter ? { hasSpecialCharacter: true } : null;
    };
  }

  // Constructor for initializing the form
  constructor(private formBuilder: FormBuilder) {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, this.specialCharValidator()]],
      image: ['', [Validators.required]],
      price: ['', [Validators.required]],
      rating: [0],
    });
  }

  // Convert Image to Base64
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if(input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64Image = reader.result as string;

        this.product = {
          ...this.productForm.value,
          image: base64Image
        }
      }

      reader.readAsDataURL(file);
    }
  }

  // Update form values when input properties change
  ngOnChanges() {
    this.productForm.patchValue(this.product);
  }

  // Handle confirm dialog
  onConfirm() {
    this.productForm.patchValue(this.product);
    this.confirm.emit(this.productForm.value);
    this.display = false;
    this.displayChange.emit(this.display);
  }

  // Handle cancel dialog
  onCancel() {
    this.display = false;
    this.displayChange.emit(this.display);
  }
}
