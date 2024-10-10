import { isPlatformBrowser } from '@angular/common';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Dictionary } from '@shared/types/base';
import { isEmpty } from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { environment } from '@/environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpCustomInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<unknown> =
    new BehaviorSubject<unknown>(null);

  private get accessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly messageService: NzMessageService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const paths = ['/auth/token', '/auth/refresh'];

    if (!paths.some(path => request.url.endsWith(path))) {
      const expiresAt = localStorage.getItem('expires_at');
      const refreshToken = localStorage.getItem('refresh_token');
      const refreshTokenExpiresAt = localStorage.getItem(
        'refresh_token_expires_at'
      );
      if (this.accessToken && expiresAt) {
        const expiresTime = parseInt(expiresAt, 0);
        if (
          expiresTime < new Date().getTime() &&
          refreshToken &&
          refreshTokenExpiresAt
        ) {
          const refreshTokenExpiresTime = parseInt(refreshTokenExpiresAt, 0);
          // const isRememberMe = localStorage.getItem('remember_me');
          if (refreshTokenExpiresTime < new Date().getTime()) {
            this.authService.removeTokenStorage();
          } else {
            if (this.refreshTokenInProgress) {
              return this.refreshTokenSubject.pipe(
                filter(result => result !== null),
                take(1),
                switchMap(() => this.nextHandle(request, next))
              );
            } else {
              this.refreshTokenInProgress = true;
              this.refreshTokenSubject.next(null);

              return this.authService.refreshToken().pipe(
                switchMap(data => {
                  this.refreshTokenInProgress = false;
                  this.authService.setTokenStorage(data);
                  this.refreshTokenSubject.next(data.accessToken);
                  return this.nextHandle(request, next);
                })
              );
            }
          }
        }
      }
    }

    return this.nextHandle(request, next);
  }

  private addHeader(request: HttpRequest<unknown>) {
    request = request.clone({
      headers: request.headers.set('Locale', `en`),
    });

    if (!request.url.startsWith('http')) {
      const url = isPlatformBrowser(this.platformId)
        ? environment.apis.default.url
        : environment.apis.default.url;
      request = request.clone({
        url: url + request.url,
      });
    }

    if (request.body && !request.url.includes('/api/v1/auth/')) {
      request = request.clone({
        body: this.handleRequestBody(request.body),
      });
    }

    if (this.accessToken && !request.url.endsWith('/auth/refresh')) {
      request = request.clone({
        headers: request.headers.set(
          'Authorization',
          `Bearer ${this.accessToken}`
        ),
      });
    }

    return request;
  }

  private nextHandle(request: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(this.addHeader(request)).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof Blob) {
          error.error.text().then(data => {
            this._handleError(JSON.parse(data));
          });
        } else {
          this._handleError(error.error);
        }

        return throwError(() => {
          throw error.error;
        });
      })
    );
  }

  private handleRequestBody(body: Dictionary): Dictionary {
    if (isEmpty(body)) return body;

    Object.entries(body).forEach(([k, v]) => {
      if (typeof v === 'string') {
        body[k] = v.trim();
      }

      if (v === '') {
        body[k] = null;
      }

      if (typeof v === 'object') {
        body[k] = this.handleRequestBody(v);
      }
    });

    return body;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  private _handleError(error: any): void {
    const errorMessage = error?.error?.message || error?.message;
    const statusCode = error?.statusCode;
    // const url: string = error?.url;

    const statusCodeHandle: {
      [key: number]: () => void;
    } = {
      404: () => {
        const excludeCode = ['AUTH_NOT_FOUND'];

        if (excludeCode.includes(error?.errorCode)) {
          this.messageService.error(errorMessage);
          return;
        }
        this.router.navigate(['/error/404']).then();
      },
      401: () => {
        if (
          ['ACCOUNT_LOCK', 'ACCOUNT_INACTIVE', 'UNAUTHORIZED'].includes(
            error?.errorCode
          )
        ) {
          this.authService.removeTokenStorage();
          this.router.navigate(['/login']).then();
        } else {
          this.router.navigate(['/error/401']).then();
        }
      },
      500: () => {
        this.router.navigate(['/error/500']).then();
      },
      0: () => {
        this.messageService.error(errorMessage);
      },
    };

    (statusCodeHandle[statusCode] || statusCodeHandle[0])();
  }
}
