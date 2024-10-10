import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { PermissionService } from '@services/permission.service';

export const PermissionGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const permissions: string[] = collectPermissions(route);

  return (
    (await inject(PermissionService).checkPermissions(permissions)) ||
    router.createUrlTree(['/error/401'])
  );
};

const collectPermissions = (route: ActivatedRouteSnapshot): string[] => {
  let permissions: string[] = [];

  if (route.data && route.data['permissions']) {
    permissions = [...permissions, route.data['permissions']];
  }

  if (route.firstChild) {
    permissions = [...permissions, ...collectPermissions(route.firstChild)];
  }

  return Array.from(new Set(permissions));
};
