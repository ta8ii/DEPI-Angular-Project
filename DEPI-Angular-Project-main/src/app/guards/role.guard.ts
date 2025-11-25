import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();
  const requiredRoles = route.data['roles'] as string[];

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    // Redirect based on user role
    if (user.role === 'student') {
      router.navigate(['/student/home']);
    } else if (user.role === 'instructor') {
      router.navigate(['/instructor/home']);
    } else {
      router.navigate(['/home']);
    }
    return false;
  }

  return true;
};

