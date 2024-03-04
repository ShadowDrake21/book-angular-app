import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ResetPasswordComponent } from './pages/login/components/reset-password/reset-password.component';
import { secureInnerPageGuard } from './core/guards/secure-inner-page.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: 'login/reset-password', component: ResetPasswordComponent },
  {
    path: 'registration',
    loadComponent: () =>
      import('./pages/registration/registration.component').then(
        (m) => m.RegistrationComponent
      ),
  },
  {
    path: 'home',
    canActivate: [secureInnerPageGuard],
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'booklist',
    canActivate: [secureInnerPageGuard],
    loadComponent: () =>
      import('./pages/booklist/booklist.component').then(
        (m) => m.BooklistComponent
      ),
  },
  {
    path: 'booklist-item/:bookid',
    canActivate: [secureInnerPageGuard],
    loadComponent: () =>
      import('./pages/booklist-item/booklist-item.component').then(
        (m) => m.BooklistItemComponent
      ),
  },
  {
    path: 'userlist',
    canActivate: [secureInnerPageGuard],
    loadComponent: () =>
      import('./pages/userlist/userlist.component').then(
        (m) => m.UserlistComponent
      ),
  },
  {
    path: 'userlist/:userid',
    canActivate: [secureInnerPageGuard],
    loadComponent: () =>
      import('./pages/userlist-item/userlist-item.component').then(
        (m) => m.UserlistItemComponent
      ),
  },
  {
    path: 'authorlist',
    canActivate: [secureInnerPageGuard],
    loadComponent: () =>
      import('./pages/authorlist/authorlist.component').then(
        (m) => m.AuthorlistComponent
      ),
  },
  {
    path: 'authorlist/:authorid',
    canActivate: [secureInnerPageGuard],
    loadComponent: () =>
      import('./pages/authorlist-item/authorlist-item.component').then(
        (m) => m.AuthorlistItemComponent
      ),
  },
  {
    path: 'favourites',
    canActivate: [secureInnerPageGuard],
    loadComponent: () =>
      import('./pages/favorites/favorites.component').then(
        (m) => m.FavoritesComponent
      ),
  },
  {
    path: 'contact-me',
    canActivate: [secureInnerPageGuard],
    loadComponent: () =>
      import('./pages/contact-me/contact-me.component').then(
        (m) => m.ContactMeComponent
      ),
  },
  {
    path: 'about-developer',
    canActivate: [secureInnerPageGuard],
    loadComponent: () =>
      import('./pages/about-developer/about-developer.component').then(
        (m) => m.AboutDeveloperComponent
      ),
  },
  {
    path: 'notifications',
    canActivate: [secureInnerPageGuard],
    loadComponent: () =>
      import('./pages/notifications/notifications.component').then(
        (m) => m.NotificationsComponent
      ),
  },
  {
    path: 'my-profile',
    canActivate: [secureInnerPageGuard],
    loadComponent: () =>
      import('./pages/my-profile/my-profile.component').then(
        (m) => m.MyProfileComponent
      ),
  },
  {
    path: 'my-friends',
    canActivate: [secureInnerPageGuard],
    loadComponent: () =>
      import('./pages/my-friends/my-friends.component').then(
        (m) => m.MyFriendsComponent
      ),
  },
  {
    path: 'my-reading-challenges',
    canActivate: [secureInnerPageGuard],
    loadComponent: () =>
      import(
        './pages/my-reading-challenges/my-reading-challenges.component'
      ).then((m) => m.MyReadingChallengesComponent),
  },
  {
    path: 'my-quotes',
    canActivate: [secureInnerPageGuard],
    loadComponent: () =>
      import('./pages/my-quotes/my-quotes.component').then(
        (m) => m.MyQuotesComponent
      ),
  },
  {
    path: 'my-favorite-genres',
    canActivate: [secureInnerPageGuard],
    loadComponent: () =>
      import('./pages/my-favourite-genres/my-favourite-genres.component').then(
        (m) => m.MyFavouriteGenresComponent
      ),
  },
  {
    path: 'my-account-settings',
    canActivate: [secureInnerPageGuard],
    loadComponent: () =>
      import('./pages/my-account-settings/my-account-settings.component').then(
        (m) => m.MyAccountSettingsComponent
      ),
  },
];
