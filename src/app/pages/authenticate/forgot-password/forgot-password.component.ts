import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

import { AppBaseComponent } from '@/app/shared/app.base.component';
import { EMAIL_REGEX } from '@/app/shared/constant/regex';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent
  extends AppBaseComponent
  implements OnInit
{
  validateForm: FormGroup = this.formbuilder.group({
    email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
  });

  nzErrorEmail: string = 'This field must be an email!';

  isSended: boolean = false;

  private _errorMsg?: string;

  constructor(
    injector: Injector,
    private formbuilder: NonNullableFormBuilder
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.validateForm.statusChanges.subscribe(status => {
      if (status === 'VALID' && this._errorMsg) {
        this._errorMsg = undefined;
      }
    });
  }

  get errorMsg(): string | undefined {
    return `${this._errorMsg || ''}`?.trim();
  }

  send() {
    if (this.validateForm.valid) {
      this.authService.forgot(this.validateForm.value).subscribe({
        next: () => (this.isSended = true),
      });
    }
  }
}
