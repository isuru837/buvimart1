import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { SignIn } from './components/sign-in/sign-in';
import { SignUp } from './components/sign-up/sign-up';
import { Profile } from './components/profile/profile';
import { EditProfile } from './components/profile/edit-profile';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', component: ProductList },
  { path: 'sign-in', component: SignIn },
  { path: 'sign-up', component: SignUp },
  { path: 'profile', component: Profile },
  { path: 'profile/edit', component: EditProfile },
  { path: 'admin', component: AdminDashboard },
  { path: '**', redirectTo: '' }
];
