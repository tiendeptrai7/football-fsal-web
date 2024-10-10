import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@/environments/environment';

import {
  CreateEventFormDto,
  EventFormDto,
  QueryEventForm,
  UpdateEventFormDto,
} from '../types/event-form';
import { AppBaseService } from './app-base.service';

@Injectable({ providedIn: 'root' })
export class EventFormService extends AppBaseService<
  number,
  EventFormDto,
  CreateEventFormDto,
  UpdateEventFormDto,
  QueryEventForm
> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.apis.default.apiPrefix, 'event-form');
  }
}
