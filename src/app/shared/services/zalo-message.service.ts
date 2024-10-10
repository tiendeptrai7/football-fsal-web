import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@/environments/environment';

import { ExportDto } from '../types/base';
import {
  ObserveMessageDto,
  QueryZaloMessageDto,
  ZaloMessageDto,
} from '../types/zalo-message';
import { getUrlParams } from '../utils/common-helper';
import { AppBaseService } from './app-base.service';

@Injectable({ providedIn: 'root' })
export class ZaloMessageService extends AppBaseService<
  number,
  ZaloMessageDto,
  Record<string, never>,
  Record<string, never>,
  QueryZaloMessageDto
> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.apis.default.apiPrefix, 'zalo-messages');
  }

  getObserverList(): Observable<
    { observer_id: string; observer_name: string }[]
  > {
    return this.httpClient.get<
      { observer_id: string; observer_name: string }[]
    >(`${this.apiUrl}/observers`);
  }

  observeMessages(body: ObserveMessageDto): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}/observes`, body);
  }

  export(params: QueryZaloMessageDto): Observable<ExportDto> {
    return this.httpClient.get<ExportDto>(
      `${this.apiUrl}/export` + getUrlParams(params)
    );
  }
}
