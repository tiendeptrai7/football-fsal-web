import { NgModule } from '@angular/core';
import { CreateEditRoleComponent } from '@pages/role/create-edit-role/create-edit-role.component';
import { RoleComponent } from '@pages/role/role.component';
import { RoleRoutingModule } from '@pages/role/role-routing.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [RoleComponent, CreateEditRoleComponent],
  imports: [SharedModule, RoleRoutingModule],
})
export class RoleModule {}
