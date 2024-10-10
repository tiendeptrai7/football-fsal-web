import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateEditFeedbackComponent } from './create-edit-feedback/create-edit-feedback.component';
import { FeedbackComponent } from './feedback.component';

const routes: Routes = [
  {
    path: '',
    component: FeedbackComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'create',
    component: CreateEditFeedbackComponent,
    data: {
      title: 'Create',
    },
  },
  {
    path: 'edit/:id',
    component: CreateEditFeedbackComponent,
    data: {
      title: 'Edit',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedbackRoutingModule {}
