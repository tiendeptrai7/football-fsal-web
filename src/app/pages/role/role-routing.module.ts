import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateEditRoleComponent } from '@pages/role/create-edit-role/create-edit-role.component';
import { RoleComponent } from '@pages/role/role.component';

const routes: Routes = [
  {
    path: '',
    component: RoleComponent,
    data: {
      title: '',
      permissions: 'role_manage_read',
    },
  },
  {
    path: 'create',
    component: CreateEditRoleComponent,
    data: {
      title: 'Create',
      permissions: 'role_manage_create',
    },
  },
  {
    path: 'edit/:id',
    component: CreateEditRoleComponent,
    data: {
      title: 'Update',
      permissions: 'role_manage_update',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleRoutingModule {}
