import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { secureInnerPageGuard } from './core/guards/secure-inner-page.guard';
import { ResetPasswordComponent } from './pages/login/components/reset-password/reset-password.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [secureInnerPageGuard],
  },
  { path: 'login/reset-password', component: ResetPasswordComponent },
  {
    path: 'registration',
    // canActivate: [secureInnerPageGuard],
    loadComponent: () =>
      import('./pages/registration/registration.component').then(
        (m) => m.RegistrationComponent
      ),
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
    path: 'favourites',
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
  {
    path: 'notifications',
    loadComponent: () =>
      import('./pages/notifications/notifications.component').then(
        (m) => m.NotificationsComponent
      ),
  },
  {
    path: 'chats',
    loadComponent: () =>
      import('./pages/chats/chats.component').then((m) => m.ChatsComponent),
  },
  {
    path: 'my-profile',
    loadComponent: () =>
      import('./pages/my-profile/my-profile.component').then(
        (m) => m.MyProfileComponent
      ),
  },
  {
    path: 'my-friends',
    loadComponent: () =>
      import('./pages/my-friends/my-friends.component').then(
        (m) => m.MyFriendsComponent
      ),
  },
  {
    path: 'my-reading-challenges',
    loadComponent: () =>
      import(
        './pages/my-reading-challenges/my-reading-challenges.component'
      ).then((m) => m.MyReadingChallengesComponent),
  },
  {
    path: 'my-quotes',
    loadComponent: () =>
      import('./pages/my-quotes/my-quotes.component').then(
        (m) => m.MyQuotesComponent
      ),
  },
  {
    path: 'my-favorite-genres',
    loadComponent: () =>
      import('./pages/my-favourite-genres/my-favourite-genres.component').then(
        (m) => m.MyFavouriteGenresComponent
      ),
  },
  {
    path: 'my-account-settings',
    loadComponent: () =>
      import('./pages/my-account-settings/my-account-settings.component').then(
        (m) => m.MyAccountSettingsComponent
      ),
  },
];
