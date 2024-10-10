import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@/environments/environment';

import { CreateLog, EditLog, LogDto, QueryLog } from '../types/log';
import { AppBaseService } from './app-base.service';

@Injectable({
  providedIn: 'root',
})
export class LogService extends AppBaseService<
  number,
  LogDto,
  CreateLog,
  EditLog,
  QueryLog
> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.apis.default.apiPrefix, 'logs');
  }

  getListLog(): Observable<{ data: string[] }> {
    return this.httpClient.get<{ data: string[] }>(this.apiUrl);
  }

  getLog(logName: string) {
    return this.httpClient.get(`${this.apiUrl}/${logName}`, {
      responseType: 'arraybuffer',
    });
  }
}
