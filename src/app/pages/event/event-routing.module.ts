import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateEditEventComponent } from './create-edit-event/create-edit-event.component';
import { EventComponent } from './event.component';

const routes: Routes = [
  {
    path: '',
    component: EventComponent,
    data: {
      title: '',
      permissions: 'event_manage_read',
    },
  },
  {
    path: 'edit/:id',
    component: CreateEditEventComponent,
    data: {
      title: 'Edit',
      permissions: 'event_manage_update',
    },
  },
  {
    path: 'create',
    component: CreateEditEventComponent,
    data: {
      title: 'Create',
      permissions: 'event_manage_create',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventRoutingModule {}
