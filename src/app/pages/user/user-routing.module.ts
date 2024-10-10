import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateEditUserComponent } from '@pages/user/create-edit-user/create-edit-user.component';
import { UserComponent } from '@pages/user/user.component';
import { PermissionGuard } from '@shared/guards/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    data: {
      title: '',
      permissions: 'user_manage_read',
    },
  },
  {
    path: 'create',
    canActivate: [PermissionGuard],
    component: CreateEditUserComponent,
    data: {
      title: 'Create',
      permissions: 'user_manage_create',
    },
  },
  {
    path: 'edit/:id',
    canActivate: [PermissionGuard],
    component: CreateEditUserComponent,
    data: {
      title: 'Update',
      permissions: 'user_manage_update',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
