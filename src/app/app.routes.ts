import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'booklist',
    loadComponent: () =>
      import('./pages/booklist/booklist.component').then(
        (m) => m.BooklistComponent
      ),
  },
  {
    path: 'booklist/:bookid',
    loadComponent: () =>
      import('./pages/booklist-item/booklist-item.component').then(
        (m) => m.BooklistItemComponent
      ),
  },
  {
    path: 'userlist',
    loadComponent: () =>
      import('./pages/userlist/userlist.component').then(
        (m) => m.UserlistComponent
      ),
  },
  {
    path: 'userlist/:userid',
    loadComponent: () =>
      import('./pages/userlist-item/userlist-item.component').then(
        (m) => m.UserlistItemComponent
      ),
  },
  {
    path: 'favourite-books',
    loadComponent: () =>
      import('./pages/favbooks/favbooks.component').then(
        (m) => m.FavbooksComponent
      ),
  },
];
