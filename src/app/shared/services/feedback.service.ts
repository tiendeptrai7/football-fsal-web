import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@/environments/environment';

import {
  CreateFeedbackDto,
  FeedbackDto,
  QueryFeedbackDto,
  UpdateFeedbackDto,
} from '../types/feedback';
import { AppBaseService } from './app-base.service';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService extends AppBaseService<
  number,
  FeedbackDto,
  CreateFeedbackDto,
  UpdateFeedbackDto,
  QueryFeedbackDto
> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.apis.default.apiPrefix, 'feedbacks');
  }
}
