import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { SignIn } from './components/sign-in/sign-in';

export const routes: Routes = [
  { path: '', component: ProductList },
  { path: 'sign-in', component: SignIn }
];
