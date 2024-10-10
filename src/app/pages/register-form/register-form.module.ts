import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@/app/shared/shared.module';

import { CreateEditFormComponent } from './create-edit-form/create-edit-form.component';
import { RegisterFormComponent } from './register-form.component';
import { RegisterFormRoutingModule } from './register-form-routing.module';

@NgModule({
  declarations: [RegisterFormComponent, CreateEditFormComponent],
  imports: [CommonModule, SharedModule, RegisterFormRoutingModule],
})
export class RegisterFormModule {}
