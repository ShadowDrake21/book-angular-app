import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { secureInnerPageGuard } from './core/guards/secure-inner-page.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [secureInnerPageGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    // canActivate: [secureInnerPageGuard],
    // loadComponent: () =>
    //   import('./pages/register/register.component').then(
    //     (m) => m.RegisterComponent
    //   ),
  },
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
    path: 'booklist-item/:bookid',
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
    path: 'authorlist',
    loadComponent: () =>
      import('./pages/authorlist/authorlist.component').then(
        (m) => m.AuthorlistComponent
      ),
  },
  {
    path: 'authorlist/:authorid',
    loadComponent: () =>
      import('./pages/authorlist-item/authorlist-item.component').then(
        (m) => m.AuthorlistItemComponent
      ),
  },
  {
    path: 'favourite-books',
    loadComponent: () =>
      import('./pages/favorites/favorites.component').then(
        (m) => m.FavoritesComponent
      ),
  },
  {
    path: 'contact-me',
    loadComponent: () =>
      import('./pages/contact-me/contact-me.component').then(
        (m) => m.ContactMeComponent
      ),
  },
  {
    path: 'about-developer',
    loadComponent: () =>
      import('./pages/about-developer/about-developer.component').then(
        (m) => m.AboutDeveloperComponent
      ),
  },
];
