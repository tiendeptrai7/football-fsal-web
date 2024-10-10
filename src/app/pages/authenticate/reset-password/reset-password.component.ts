import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

import { AppBaseComponent } from '@/app/shared/app.base.component';
import { STRONG_PASSWORD_REGEX } from '@/app/shared/constant/regex';
import { ResetPasswordRequest } from '@/app/shared/types/auth';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent extends AppBaseComponent implements OnInit {
  validateForm: FormGroup = this.formBuilder.group({
    new_password: [
      '',
      [Validators.required, Validators.pattern(STRONG_PASSWORD_REGEX)],
    ],
    confirm_password: [
      '',
      [Validators.required, this.formControlCompareWith('new_password')],
    ],
  });

  nzErrorPasswordConfirm: string = 'Passwords do not match!';
  nzErrorInvalidPassword: string = 'The password is invalid.';

  isTokenValid: boolean = false;
  isSuccessReset: boolean = false;
  token: string = '';

  isVisibleNPassword = false;
  isVisibleRPassword = false;

  constructor(
    injector: Injector,
    private formBuilder: NonNullableFormBuilder
  ) {
    super(injector);
  }

  ngOnInit(): void {
    const queryParams = this.activeRoute.snapshot.queryParams;
    this.token = queryParams?.['token'] || '';

    if (this.token) {
      this.authService.verify({ token: this.token }).subscribe({
        next: () => (this.isTokenValid = true),
      });
    }
  }

  resetPassword() {
    const input: ResetPasswordRequest = {
      password: this.validateForm.value['new_password'],
      token: this.token,
    };
    this.authService.resetPassword(input).subscribe({
      next: () => {
        this.isTokenValid = false;
        this.isSuccessReset = true;
      },
    });
  }

  updateConfirmPasswordValidator(): void {
    Promise.resolve().then(() =>
      this.validateForm.controls['confirm_password'].updateValueAndValidity()
    );
  }
}
