import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventGuestComponent } from './event-guest.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: '',
    },
    children: [
      {
        path: '',
        component: EventGuestComponent,
        data: {
          permissions: 'event_guest_manage_read',
          dynamic: true,
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
export class EventGuestRoutingModule {}
