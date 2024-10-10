import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@/environments/environment';

import { ExportDto } from '../types/base';
import { HcpDto, QueryHcpDto } from '../types/hcp';
import { HcpUpdateHistory } from '../types/hcp-update-history';
import { getUrlParams } from '../utils/common-helper';
import { AppBaseService } from './app-base.service';

@Injectable({
  providedIn: 'root',
})
export class HcpService extends AppBaseService<
  number,
  HcpDto,
  Record<string, never>,
  Record<string, never>,
  QueryHcpDto
> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.apis.default.apiPrefix, 'hcps');
  }

  getListHcpHasRef(): Observable<HcpDto[]> {
    return this.httpClient.get<HcpDto[]>(`${this.apiUrl}/referred`);
  }

  getHcpUpdateHistories(id: number): Observable<HcpUpdateHistory[]> {
    return this.httpClient.get<HcpUpdateHistory[]>(
      `${this.apiUrl}/${id}/histories`
    );
  }

  export(params: QueryHcpDto): Observable<ExportDto> {
    return this.httpClient.get<ExportDto>(
      `${this.apiUrl}/export` + getUrlParams(params)
    );
  }
}
