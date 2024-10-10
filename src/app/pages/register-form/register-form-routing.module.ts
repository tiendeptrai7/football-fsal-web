import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateEditFormComponent } from './create-edit-form/create-edit-form.component';
import { RegisterFormComponent } from './register-form.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterFormComponent,
    data: {
      title: '',
      permissions: 'event_form_manage_read',
    },
  },
  {
    path: 'create',
    component: CreateEditFormComponent,
    data: {
      title: 'Create',
      permissions: 'event_form_manage_create',
    },
  },
  {
    path: 'edit/:id',
    component: CreateEditFormComponent,
    data: {
      title: 'Edit',
      permissions: 'event_form_manage_update',
    },
  },
  {
    path: 'clone/:id',
    component: CreateEditFormComponent,
    data: {
      title: 'Clone',
      permissions: 'event_form_manage_create',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterFormRoutingModule {}
