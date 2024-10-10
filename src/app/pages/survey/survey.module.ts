import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CreateEditSurveyComponent } from './edit/create-edit-survey.component';
import { SurveyComponent } from './survey.component';
import { SurveyRoutingModule } from './survey-routing.module';

@NgModule({
  declarations: [SurveyComponent, CreateEditSurveyComponent],
  imports: [SharedModule, SurveyRoutingModule],
})
export class SurveyModule {}
