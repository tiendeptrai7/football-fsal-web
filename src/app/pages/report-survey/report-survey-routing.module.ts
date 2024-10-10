import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReportPariticipantComponent } from './participant-list/report-participant.component';
import { ReportSurveyComponent } from './report-survey.component';
import { SurveyResultComponent } from './survey-result/survey-result.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: '',
    },
    children: [
      {
        path: '',
        component: ReportSurveyComponent,
        data: {
          permissions: 'survey_report_manage_read',
          dynamic: true,
        },
      },
      {
        path: 'participant-list',
        component: ReportPariticipantComponent,
        data: {
          permissions: 'survey_report_manage_read',
          dynamic: true,
          title: 'Participant List',
        },
      },
      {
        path: 'results',
        component: SurveyResultComponent,
        data: {
          permissions: 'survey_report_manage_read',
          dynamic: true,
          title: 'Survey result',
        },
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/error/404',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportSurveyRoutingModule {}
