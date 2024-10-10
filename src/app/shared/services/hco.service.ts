import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@/environments/environment';

import { BaseQuery } from '../types/base';
import { HcoDto } from '../types/hco';
import { AppBaseService } from './app-base.service';

@Injectable({ providedIn: 'root' })
export class HcoService extends AppBaseService<
  number,
  HcoDto,
  Record<string, never>,
  Record<string, never>,
  BaseQuery
> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.apis.default.apiPrefix, 'hcos');
  }
}
