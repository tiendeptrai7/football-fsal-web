import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@/environments/environment';

import {
  CreateEvent,
  EditEvent,
  EventDto,
  QueryEvent,
  QueryEventRelatedHcp,
} from '../types/event';
import { EventRelatedHCPDto } from '../types/hco';
import { getUrlParams } from '../utils/common-helper';
import { AppBaseService } from './app-base.service';

@Injectable({
  providedIn: 'root',
})
export class EventService extends AppBaseService<
  number,
  EventDto,
  CreateEvent,
  EditEvent,
  QueryEvent
> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.apis.default.apiPrefix, 'events');
  }

  getListEventRelatedHCP(
    params?: QueryEventRelatedHcp
  ): Observable<EventRelatedHCPDto[]> {
    return this.httpClient.get<EventRelatedHCPDto[]>(
      `${this.apiUrl}/hcp-relations` + getUrlParams(params || {})
    );
  }
}
