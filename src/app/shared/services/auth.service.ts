import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ChangePassword,
  ForgotRequest,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  TokenPayload,
  VerifyRequest,
} from '@shared/types/auth';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  protected readonly apiUrlAuth: string;
  constructor(private readonly httpClient: HttpClient) {
    this.apiUrlAuth =
      environment.apis.auth.url + environment.apis.auth.apiPrefix;
  }

  login(input: LoginRequest): Observable<LoginResponse> {
    const body = new URLSearchParams(
      Object.entries({ ...input, scope: 'admin', grant_type: 'password' })
    ).toString();
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.httpClient.post<LoginResponse>(
      this.apiUrlAuth + '/auth/token',
      body,
      {
        headers,
      }
    );
  }

  logout(): Observable<null> {
    return this.httpClient.post<null>(this.apiUrlAuth + '/auth/revoke', null);
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${refreshToken}`,
    });
    return this.httpClient.post<LoginResponse>(
      this.apiUrlAuth + '/auth/refresh',
      null,
      {
        headers,
      }
    );
  }

  changePassword(body: ChangePassword): Observable<void> {
    return this.httpClient.post<void>(
      this.apiUrlAuth + '/auth/change-password',
      body
    );
  }

  forgot(input: ForgotRequest) {
    return this.httpClient.post(this.apiUrlAuth + `/auth/forgot`, input);
  }

  verify(input: VerifyRequest) {
    return this.httpClient.post(this.apiUrlAuth + `/auth/verify`, input);
  }

  resetPassword(input: ResetPasswordRequest) {
    return this.httpClient.post(
      this.apiUrlAuth + `/auth/reset-password`,
      input
    );
  }

  setTokenStorage(data: LoginResponse) {
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    localStorage.setItem('user_id', data.user.id);
    localStorage.setItem(
      'expires_at',
      new Date(data.accessTokenExpiresAt).getTime().toString()
    );
    localStorage.setItem(
      'refresh_token_expires_at',
      new Date(data.refreshTokenExpiresAt).getTime().toString()
    );
  }

  removeTokenStorage() {
    localStorage.removeItem('remember_me');
    localStorage.removeItem('is_change_password');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('refresh_token_expires_at');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (!token) {
      return false;
    }
    const tokenObj = jwtDecode<TokenPayload>(token);
    if (!tokenObj || tokenObj?.exp < dayjs().unix()) {
      if (!refreshToken) {
        return false;
      }
      const refreshTokenObj = jwtDecode<TokenPayload>(refreshToken);
      if (!refreshTokenObj || refreshTokenObj?.exp < dayjs().unix()) {
        return false;
      }
    }
    return true;
  }

  checkAccount(body: { username: string; password: string }): Observable<void> {
    return this.httpClient.post<void>(
      `${this.apiUrlAuth}/auth/check-accounts`,
      body
    );
  }
}
