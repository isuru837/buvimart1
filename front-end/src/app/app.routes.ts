import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { SignIn } from './components/sign-in/sign-in';
import { SignUp } from './components/sign-up/sign-up';

export const routes: Routes = [
  { path: '', component: ProductList },
  { path: 'sign-in', component: SignIn },
  { path: 'sign-up', component: SignUp },
  { path: '**', redirectTo: '' }
];
