import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@/environments/environment';

import { MedRepDto, QueryMedRepDto } from '../types/med-rep';
import { AppBaseService } from './app-base.service';

@Injectable({
  providedIn: 'root',
})
export class MedRepService extends AppBaseService<
  number,
  MedRepDto,
  Record<string, never>,
  Record<string, never>,
  QueryMedRepDto
> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.apis.default.apiPrefix, 'med-reps');
  }

  getAll(): Observable<MedRepDto[]> {
    return this.httpClient.get<MedRepDto[]>(`${this.apiUrl}/all`);
  }
}
