import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateEditRecapComponent } from './create-edit-recap/create-edit-recap.component';
import { RecapComponent } from './recap.component';

const routes: Routes = [
  {
    path: '',
    component: RecapComponent,
    data: {
      title: '',
      permissions: 'recap_manage_read',
    },
  },
  {
    path: 'create',
    component: CreateEditRecapComponent,
    data: {
      title: 'Create',
      permissions: 'recap_manage_create',
    },
  },
  {
    path: 'edit/:id',
    component: CreateEditRecapComponent,
    data: {
      title: 'Edit',
      permissions: 'recap_manage_update',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecapRoutingModule {}
