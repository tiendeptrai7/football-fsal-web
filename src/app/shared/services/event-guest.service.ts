import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@/environments/environment';

import { ImportResultDto } from '../components/upload-file-modal/upload-file-modal.component';
import {
  EditEventGuest,
  EventGuestDto,
  ImportEventGuestDto,
  QueryEventGuest,
} from '../types/event-guest';
import { AppBaseService } from './app-base.service';

@Injectable({
  providedIn: 'root',
})
export class EventGuestService extends AppBaseService<
  number,
  EventGuestDto,
  Record<string, never>,
  EditEventGuest,
  QueryEventGuest
> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.apis.default.apiPrefix, 'event-guest');
  }

  import(body: ImportEventGuestDto): Observable<ImportResultDto> {
    return this.httpClient.post<ImportResultDto>(`${this.apiUrl}/import`, body);
  }
}
