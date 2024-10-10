import {
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { AppBaseComponent } from '@/app/shared/app.base.component';
import { UserService } from '@/app/shared/services/user.service';
import { ZaloMessageService } from '@/app/shared/services/zalo-message.service';

@Component({
  selector: 'zalo-message-observe-modal',
  templateUrl: './observe-modal.component.html',
})
export class ObserveModalComponent extends AppBaseComponent {
  @Input() isVisible: boolean = false;
  @Input() selectedNumber: number = 0;
  @Input() totalRecord: number = 0;
  @Input() handleObserveMessage?: (comment: string) => Observable<void>;

  @Output() isVisibleChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  validateForm: FormGroup = this.formBuilder.group({
    comment: ['', [Validators.required]],
    username: [
      { value: this.userService.userSimpleProfile.username, disabled: true },
      [Validators.required],
    ],
    password: ['', [Validators.required]],
  });

  isLoading: boolean = false;
  isVisiblePassword: boolean = false;

  constructor(
    injector: Injector,
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly zaloMessageService: ZaloMessageService
  ) {
    super(injector);
  }

  handleClose(): void {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  handleOK(): void {
    this.isLoading = true;

    if (this.validateForm.valid) {
      const formData = this.validateForm.getRawValue();

      this.authService
        .checkAccount({
          username: formData.username,
          password: formData.password,
        })
        .subscribe({
          next: () => {
            if (this.handleObserveMessage) {
              this.handleObserveMessage(formData.comment).subscribe({
                next: () => {
                  this.msgService.success('Observe successfully!');
                  this.isLoading = false;
                  this.handleClose();
                },
              });
            }
          },
        });
    } else {
      this.isLoading = false;
      this.validateFormGroup(this.validateForm);
    }
  }
}
