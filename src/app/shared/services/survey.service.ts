import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@/environments/environment';

import {
  CreateSurveyDto,
  QuerySurveyDto,
  SurveyDto,
  UpdateSurveyDto,
} from '../types/survey';
import { AppBaseService } from './app-base.service';

@Injectable({
  providedIn: 'root',
})
export class SurveyService extends AppBaseService<
  number,
  SurveyDto,
  CreateSurveyDto,
  UpdateSurveyDto,
  QuerySurveyDto
> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.apis.default.apiPrefix, 'surveys');
  }
}
