import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@/app/shared/shared.module';

import { CreateEditFeedbackComponent } from './create-edit-feedback/create-edit-feedback.component';
import { FeedbackComponent } from './feedback.component';
import { FeedbackRoutingModule } from './feedback-routing.module';

@NgModule({
  declarations: [FeedbackComponent, CreateEditFeedbackComponent],
  imports: [CommonModule, SharedModule, FeedbackRoutingModule],
})
export class FeedbackModule {}
