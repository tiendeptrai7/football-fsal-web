import { Component, Injector } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppBaseComponent } from '@shared/app.base.component';
import { STRONG_PASSWORD_REGEX } from '@shared/constant/regex';
import { ChangePassword } from '@shared/types/auth';

@Component({
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent extends AppBaseComponent {
  nzErrorDuplicatePassword =
    'The new password must not be the same as the old password';
  nzErrorPasswordConfirm = 'Passwords do not match!';
  nzErrorInvalidPassword = 'The new password is invalid';

  validateForm = this.formBuilder.group({
    current_password: [null, [Validators.required]],
    new_password: [
      null,
      [
        Validators.required,
        Validators.pattern(STRONG_PASSWORD_REGEX),
        this.formControlCompareWith('current_password', true),
      ],
    ],
    confirm_password: [
      null,
      [Validators.required, this.formControlCompareWith('new_password')],
    ],
  });

  isVisibleCPassword = false;
  isVisibleNPassword = false;
  isVisibleRPassword = false;

  constructor(
    injector: Injector,
    private readonly formBuilder: FormBuilder
  ) {
    super(injector);
  }

  changePassword() {
    if (this.validateForm.valid) {
      this.authService
        .changePassword({
          ...this.validateForm.value,
        } as unknown as ChangePassword)
        .subscribe(() => {
          this.msgService.success('Password changed successfully!');
          setTimeout(() => {
            this.redirect('/login');
          }, 1500);
        });
    } else {
      this.validateFormGroup(this.validateForm);
    }
  }

  updateConfirmPasswordValidator(): void {
    Promise.resolve().then(() =>
      this.validateForm.controls.confirm_password.updateValueAndValidity()
    );
  }

  updateNewPasswordValidator(): void {
    Promise.resolve().then(() =>
      this.validateForm.controls.new_password.updateValueAndValidity()
    );
  }
}
