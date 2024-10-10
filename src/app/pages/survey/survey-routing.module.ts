import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateEditSurveyComponent } from './edit/create-edit-survey.component';
import { SurveyComponent } from './survey.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: '',
    },
    children: [
      {
        path: '',
        component: SurveyComponent,
        data: {
          permissions: 'survey_manage_read',
          dynamic: true,
        },
      },
      {
        path: 'create',
        component: CreateEditSurveyComponent,
        data: {
          title: 'Create',
        },
      },
      {
        path: 'edit/:id',
        component: CreateEditSurveyComponent,
        data: {
          title: 'Edit',
        },
      },
      {
        path: 'copy/:id',
        component: CreateEditSurveyComponent,
        data: {
          title: 'Copy',
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
export class SurveyRoutingModule {}
