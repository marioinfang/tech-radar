import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { map, take } from 'rxjs/operators';
import {AuthService, UserRole} from '../features/login/services/auth.service';


export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as UserRole[];

  return authService.role$.pipe(
    take(1),
    map(role => {
      if (!role) {
        router.navigate(['/login']);
        return false;
      }

      if (expectedRoles && expectedRoles.includes(role)) {
        return true;
      }

      router.navigate(['/radar']);
      return false;
    })
  );
};
