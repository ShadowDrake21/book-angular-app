import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { StarRatingModule } from 'angular-star-rating';
import { AppComponent } from './app.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'book-angular-app-942db',
          appId: '1:869230915901:web:c1e5aadce79caeb1145554',
          storageBucket: 'book-angular-app-942db.appspot.com',
          apiKey: 'AIzaSyCCCCrPfDLKCXuMlepAL9B9O23xqaUJtkI',
          authDomain: 'book-angular-app-942db.firebaseapp.com',
          messagingSenderId: '869230915901',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(StarRatingModule.forRoot()),
  ],
};
