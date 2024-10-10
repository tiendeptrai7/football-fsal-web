import { NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChangePasswordComponent } from '@pages/authenticate/change-password/change-password.component';
import { LoginComponent } from '@pages/authenticate/login/login.component';
import { LogoutComponent } from '@pages/authenticate/logout.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { AuthenticateRoutingModule } from './authenticate-routing.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [SharedModule, AuthenticateRoutingModule, NgOptimizedImage],
})
export class AuthenticateModule {}
