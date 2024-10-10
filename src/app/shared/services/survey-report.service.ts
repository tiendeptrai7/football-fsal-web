import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@/environments/environment';

import { ExportDto, ListPaginate } from '../types/base';
import {
  BarChartDto,
  DetailResultDto,
  LineChartDto,
  OverviewResultDto,
  ParticipantReportDto,
  QueryChartDto,
  QueryParticipantReportDto,
  QuerySubmissionDetailDto,
  QuerySurveyReportDto,
  ShortAnswerDto,
  SubmissionDetailDto,
  SurveyReportDto,
} from '../types/survey-report';
import { getUrlParams } from '../utils/common-helper';
import { AppBaseService } from './app-base.service';

@Injectable({
  providedIn: 'root',
})
export class ReportSurveyService extends AppBaseService<
  number,
  SurveyReportDto,
  null,
  null,
  QuerySurveyReportDto
> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.apis.default.apiPrefix, 'surveys/reports');
  }

  getParticipants(
    params: QueryParticipantReportDto
  ): Observable<ListPaginate<ParticipantReportDto>> {
    return this.httpClient.get<ListPaginate<ParticipantReportDto>>(
      `${this.apiUrl}/participants` + getUrlParams(params)
    );
  }

  getSubmissionDetail(
    id: number,
    params: QuerySubmissionDetailDto
  ): Observable<SubmissionDetailDto> {
    return this.httpClient.get<SubmissionDetailDto>(
      `${this.apiUrl}/participants/${id}` + getUrlParams(params)
    );
  }

  export(params: QueryParticipantReportDto): Observable<ExportDto> {
    return this.httpClient.get<ExportDto>(
      `${this.apiUrl}/participants/export` + getUrlParams(params)
    );
  }

  getOverview(id: number): Observable<OverviewResultDto> {
    return this.httpClient.get<OverviewResultDto>(
      `${this.apiUrl}/overview/${id}`
    );
  }

  getDetail(id: number): Observable<DetailResultDto[]> {
    return this.httpClient.get<DetailResultDto[]>(
      `${this.apiUrl}/detail/${id}`
    );
  }

  getShortAnswer(
    id: number,
    params: QueryChartDto
  ): Observable<ShortAnswerDto[]> {
    return this.httpClient.get<ShortAnswerDto[]>(
      `${this.apiUrl}/detail/short-answer/${id}` + getUrlParams(params)
    );
  }

  getLineChart(id: number, params: QueryChartDto): Observable<LineChartDto> {
    return this.httpClient.get<LineChartDto>(
      `${this.apiUrl}/detail/line-chart/${id}` + getUrlParams(params)
    );
  }

  getBarChart(id: number, params: QueryChartDto): Observable<BarChartDto> {
    return this.httpClient.get<BarChartDto>(
      `${this.apiUrl}/detail/bar-chart/${id}` + getUrlParams(params)
    );
  }
}
