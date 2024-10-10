import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@/environments/environment';

import { CreateRecap, QueryRecap, RecapDto, UpdateRecap } from '../types/recap';
import { AppBaseService } from './app-base.service';

@Injectable({ providedIn: 'root' })
export class RecapService extends AppBaseService<
  number,
  RecapDto,
  CreateRecap,
  UpdateRecap,
  QueryRecap
> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.apis.default.apiPrefix, 'recaps');
  }
}
