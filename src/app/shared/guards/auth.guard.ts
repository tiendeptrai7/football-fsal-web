import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

export const AuthGuard: CanActivateFn = () => {
  return (
    inject(AuthService).isLoggedIn() || inject(Router).createUrlTree(['/login'])
  );
};
