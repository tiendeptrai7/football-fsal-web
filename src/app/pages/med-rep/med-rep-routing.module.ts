import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MedRepComponent } from './med-rep.component';

const routes: Routes = [
  {
    path: '',
    component: MedRepComponent,
    data: {
      title: '',
      permissions: 'medrep_manage_read',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedRepRoutingModule {}
