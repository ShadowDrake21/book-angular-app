import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../authentication/auth.service';

export const secureInnerPageGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn !== true) {
    router.navigate(['/login']);
    return false;
  } else {
    return true;
  }
};
