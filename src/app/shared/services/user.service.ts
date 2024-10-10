import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppBaseService } from '@services/app-base.service';
import {
  CreateUser,
  EditUser,
  ProfileDto,
  QueryCustomerInfo,
  QueryUser,
  QueryZaloUser,
  UserDto,
} from '@shared/types/user';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { ExportDto, ListPaginate } from '../types/base';
import { getUrlParams } from '../utils/common-helper';

@Injectable({ providedIn: 'root' })
export class UserService extends AppBaseService<
  string,
  UserDto,
  CreateUser,
  EditUser,
  QueryUser
> {
  userSimpleProfile: { username: string; name: string; role: string } = {
    username: '',
    name: '',
    role: '',
  };
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.apis.default.apiPrefix, 'users');
  }

  resetPassword(id: string): Observable<void> {
    return this.httpClient.put<void>(this.apiUrl + '/reset-password', { id });
  }

  resetLogin(id: string): Observable<void> {
    return this.httpClient.put<void>(this.apiUrl + `/reset-login/${id}`, {});
  }

  getMyProfile(): Observable<UserDto> {
    return this.httpClient.get<UserDto>(this.apiUrl + `/my-profile`);
  }

  getListCustomerInfo(
    params: QueryCustomerInfo
  ): Observable<ListPaginate<UserDto>> {
    return this.httpClient.get<ListPaginate<UserDto>>(
      `${this.apiUrl}/customer-info` + getUrlParams(params)
    );
  }

  getZaloUserByPaged(
    params: QueryZaloUser
  ): Observable<ListPaginate<ProfileDto>> {
    return this.httpClient.get<ListPaginate<ProfileDto>>(
      `${this.apiUrl}/zalo` + getUrlParams(params)
    );
  }

  exportZaloUse(params: QueryZaloUser): Observable<ExportDto> {
    return this.httpClient.get<ExportDto>(
      `${this.apiUrl}/zalo/export` + getUrlParams(params)
    );
  }
}
