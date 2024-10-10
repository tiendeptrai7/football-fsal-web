import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { AppBaseComponent } from '@shared/app.base.component';
import { Dictionary } from '@shared/types/base';
import { diffFromNow } from '@utils/date';

@Component({
  templateUrl: './login.component.html',
})
export class LoginComponent extends AppBaseComponent implements OnInit {
  validateForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  isVisiblePassword = false;
  rememberMe = false;

  private _errorMsg?: string;
  private _lockedMsg?: string;
  private _intervalId?: number;

  get errorMsg(): string | undefined {
    return `${this._errorMsg || ''} ${this._lockedMsg || ''}`?.trim();
  }

  constructor(
    injector: Injector,
    private fb: NonNullableFormBuilder
  ) {
    super(injector);
  }

  ngOnInit(): void {
    if (this.isLoggedIn) {
      this.redirect('/home');
    }

    this.validateForm.statusChanges.subscribe(status => {
      if (status === 'VALID' && this._errorMsg) {
        this._errorMsg = undefined;
      }
    });
  }

  login() {
    if (this.validateForm.valid) {
      this.authService.login(this.validateForm.value).subscribe({
        next: result => {
          if (this.rememberMe) {
            localStorage.setItem('remember_me', 'true');
          }
          this.authService.setTokenStorage(result);

          if (result.user.is_change_password) {
            localStorage.setItem('is_change_password', 'true');
            return this.redirect('/change-password');
          }

          this.redirect('/');
        },
        error: (error: { message: string; data?: Dictionary }) => {
          this.validateForm.reset();

          if (error?.data?.['locked_end']) {
            this.updateCountdown(error?.data?.['locked_end']);
            this._intervalId = window.setInterval(() => {
              this.updateCountdown(error?.data?.['locked_end']);
            }, 1000);
          }

          this._errorMsg = error.message;
        },
      });
    } else {
      this.validateFormGroup(this.validateForm);
    }
  }

  updateCountdown(lockedEnd: string): void {
    const timeDiff = diffFromNow(lockedEnd);

    if (timeDiff) {
      this._lockedMsg = `Please try again later ${timeDiff}.`;
    } else {
      this._errorMsg = undefined;
      this._lockedMsg = undefined;
      clearInterval(this._intervalId);
    }
  }
}
