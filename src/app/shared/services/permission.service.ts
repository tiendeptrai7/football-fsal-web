import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListPermissionDto } from '@shared/types/permission';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  currentPermissions: string[] = [];
  protected readonly apiUrl: string;

  constructor(private readonly httpClient: HttpClient) {
    this.apiUrl = environment.apis.default.apiPrefix + '/permissions';
  }

  getMyPermission(): Observable<string[]> {
    return this.httpClient.get<string[]>(this.apiUrl + `/my-permission`);
  }

  getList(): Observable<ListPermissionDto> {
    return this.httpClient.get<ListPermissionDto>(this.apiUrl);
  }

  clearPermssion(): void {
    this.currentPermissions = [];
  }

  async checkPermissions(permissions: string[]): Promise<boolean> {
    if (!this.currentPermissions.length) {
      this.currentPermissions = await lastValueFrom(this.getMyPermission());
    }

    if (!permissions.length) {
      return true;
    }

    return !!(
      this.currentPermissions.length &&
      permissions.every(p => this.currentPermissions?.includes(p))
    );
  }
}
