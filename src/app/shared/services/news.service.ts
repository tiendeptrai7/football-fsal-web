import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@/environments/environment';

import { CreateNews, EditNews, NewsDto, QueryNews } from '../types/news';
import { AppBaseService } from './app-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService extends AppBaseService<
  number,
  NewsDto,
  CreateNews,
  EditNews,
  QueryNews
> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.apis.default.apiPrefix, 'news');
  }

  getStandings(): Observable<any> {
    return this.httpClient.get<any>(
      `http://localhost:3000/api/v1/standing`
    );
  }

  getScorers(): Observable<any> {
    return this.httpClient.get<any>(
      `http://localhost:3000/api/v1/top-scorer`
    );
  }
}
