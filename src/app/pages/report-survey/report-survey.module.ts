import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { BarChartComponent } from './chart/bar-chart/bar-chart.component';
import { DonutChartComponent } from './chart/donut-chart/donut-chart.component';
import { LineChartComponent } from './chart/line-chart/line-chart.component';
import { ShortAnswerComponent } from './chart/short-answer/short-answer.component';
import { ReportPariticipantComponent } from './participant-list/report-participant.component';
import { ReportSurveyComponent } from './report-survey.component';
import { ReportSurveyRoutingModule } from './report-survey-routing.module';
import { SurveyResultComponent } from './survey-result/survey-result.component';

@NgModule({
  declarations: [
    ReportSurveyComponent,
    ReportPariticipantComponent,
    SurveyResultComponent,
    DonutChartComponent,
    BarChartComponent,
    LineChartComponent,
    ShortAnswerComponent,
  ],
  imports: [SharedModule, ReportSurveyRoutingModule],
})
export class ReportSurveyModule {}
