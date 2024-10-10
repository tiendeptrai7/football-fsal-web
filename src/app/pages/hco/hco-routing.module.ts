import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HcoComponent } from './hco.component';

const routes: Routes = [
  {
    path: '',
    component: HcoComponent,
    data: {
      title: '',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HcoRoutingModule {}
