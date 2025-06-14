import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignIn } from './components/sign-in/sign-in';
import { SignUp } from './components/sign-up/sign-up';
import { ProductList } from './components/product-list/product-list';

const routes: Routes = [
  { path: 'sign-in', component: SignIn },
  { path: 'sign-up', component: SignUp },
  { path: '', component: ProductList },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 