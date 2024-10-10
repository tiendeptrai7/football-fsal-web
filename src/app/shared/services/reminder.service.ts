import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@/environments/environment';

import {
  CreateReminder,
  EditReminder,
  QueryReminder,
  ReminderDto,
} from '../types/reminder';
import { AppBaseService } from './app-base.service';

@Injectable({ providedIn: 'root' })
export class ReminderService extends AppBaseService<
  number,
  ReminderDto,
  CreateReminder,
  EditReminder,
  QueryReminder
> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.apis.default.apiPrefix, 'reminders');
  }
}
