import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ProductList } from './components/product-list/product-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ProductList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'front-end';
}
