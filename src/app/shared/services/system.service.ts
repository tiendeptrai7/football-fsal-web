import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppBaseService } from '@services/app-base.service';
import { QuerySystem, SystemDto } from '@shared/types/setting';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SystemService extends AppBaseService<
  number,
  SystemDto,
  unknown,
  unknown,
  QuerySystem
> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.apis.default.apiPrefix, 'system');
  }
}
