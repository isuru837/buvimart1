import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { SignIn } from './components/sign-in/sign-in';
import { SignUp } from './components/sign-up/sign-up';
import { Profile } from './components/profile/profile';
import { EditProfile } from './components/profile/edit-profile';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { PurchaseHistory } from './components/purchase-history/purchase-history';

export const routes: Routes = [
  { path: '', component: ProductList },
  { path: 'sign-in', component: SignIn },
  { path: 'sign-up', component: SignUp },
  { path: 'profile', component: Profile },
  { path: 'profile/edit', component: EditProfile },
  { path: 'admin', component: AdminDashboard },
  { path: 'purchase-history', component: PurchaseHistory },
  { path: 'change-password', loadComponent: () => import('./components/change-password/change-password').then(m => m.ChangePassword) },
  { path: '**', redirectTo: '' }
];
