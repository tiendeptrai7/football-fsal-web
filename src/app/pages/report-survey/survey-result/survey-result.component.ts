import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppBaseComponent } from '@shared/app.base.component';

import { EQuestionType } from '@/app/shared/constant/enum';
import { SurveyService } from '@/app/shared/services/survey.service';
import { ReportSurveyService } from '@/app/shared/services/survey-report.service';
import { SurveyDto } from '@/app/shared/types/survey';
import {
  DetailResultDto,
  OverviewResultDto,
} from '@/app/shared/types/survey-report';

import { DonutChartComponent } from '../chart/donut-chart/donut-chart.component';

@Component({
  templateUrl: './survey-result.component.html',
})
export class SurveyResultComponent extends AppBaseComponent implements OnInit {
  dataOverview: OverviewResultDto | undefined = undefined;
  dataDetail: DetailResultDto[] | undefined = undefined;
  questionTypes = EQuestionType;
  survey_id!: number;

  @ViewChild(DonutChartComponent) donutChartComponent!: DonutChartComponent;

  survey!: SurveyDto;

  constructor(
    injector: Injector,
    private readonly reportSurveyService: ReportSurveyService,
    private readonly surveyService: SurveyService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(() => {
      this.survey_id = this.getQueryParam<number>('survey_id');
      this.surveyService.getById(this.survey_id).subscribe({
        next: survey => (this.survey = survey),
      });
      this.getDataOverview();
      this.getDataDetail();
    });
  }

  getDataOverview(): void {
    this.reportSurveyService.getOverview(this.survey_id).subscribe(data => {
      this.dataOverview = data;
      if (data) {
        this.donutChartComponent.updateChart(
          [data.total_completed, data.total_uncompleted],
          ['Completed', 'Uncompleted'],
          `${data?.total_completed}/${data?.total_completed + data?.total_uncompleted}`
        );
      }
    });
  }

  getDataDetail(): void {
    const survey_id = this.getQueryParam<number>('survey_id');
    this.reportSurveyService.getDetail(survey_id).subscribe(data => {
      this.dataDetail = data;
    });
  }
}
