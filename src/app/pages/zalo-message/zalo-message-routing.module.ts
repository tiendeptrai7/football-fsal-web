import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ZaloMessageComponent } from './zalo-message.component';

const routes: Routes = [
  {
    path: '',
    component: ZaloMessageComponent,
    data: {
      title: '',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZaloMessageRoutingModule {}
