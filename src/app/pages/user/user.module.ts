import { NgModule } from '@angular/core';
import { CreateEditUserComponent } from '@pages/user/create-edit-user/create-edit-user.component';
import { UserComponent } from '@pages/user/user.component';
import { UserRoutingModule } from '@pages/user/user-routing.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [UserComponent, CreateEditUserComponent],
  imports: [SharedModule, UserRoutingModule],
})
export class UserModule {}
