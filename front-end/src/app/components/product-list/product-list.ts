import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList {
  products = [
    { name: 'Laptop', price: 1200, quantity: 10 },
    { name: 'Phone', price: 800, quantity: 25 },
    { name: 'Headphones', price: 150, quantity: 40 },
    { name: 'Keyboard', price: 100, quantity: 15 },
    { name: 'Mouse', price: 50, quantity: 30 },
    { name: 'Speaker', price: 200, quantity: 10 },
    { name: 'Monitor', price: 300, quantity: 5 },
    { name: 'Printer', price: 150, quantity: 20 },
    { name: 'Tablet', price: 250, quantity: 15 },
    { name: 'Camera', price: 400, quantity: 8 },  
    
  ];
}
