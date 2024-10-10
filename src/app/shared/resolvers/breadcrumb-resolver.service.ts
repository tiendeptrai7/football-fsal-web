import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, MaybeAsync, Resolve } from '@angular/router';
import { isEmpty } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbResolverService implements Resolve<string> {
  constructor() {}

  resolve(route: ActivatedRouteSnapshot): MaybeAsync<string> {
    const type = Object.values(route.params)?.[0];
    const typeMapping = route.data?.['typeMapping'] || {};

    if (isEmpty(typeMapping)) return '';

    return typeMapping[type];
  }
}
