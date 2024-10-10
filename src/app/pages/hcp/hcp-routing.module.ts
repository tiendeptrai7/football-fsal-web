import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HcpComponent } from './hcp.component';
import { HcpDetailComponent } from './hcp-detail/hcp-detail.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: '',
      permissions: 'hcp_manage_read',
    },
    children: [
      {
        path: '',
        component: HcpComponent,
      },
      {
        path: ':id',
        component: HcpDetailComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HcpRoutingModule {}
