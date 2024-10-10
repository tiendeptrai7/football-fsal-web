import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EStatus } from '@shared/constant/enum';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { AppBaseComponent } from 'src/app/shared/app.base.component';

import { UploadComponent } from '@/app/shared/components/upload/upload.component';
import { EventService } from '@/app/shared/services/event.service';
import { CreateEvent, EditEvent } from '@/app/shared/types/event';

@Component({
  templateUrl: './create-edit-event.component.html',
})
export class CreateEditEventComponent
  extends AppBaseComponent
  implements OnInit
{
  validateForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    content: ['', [Validators.required]],
    image_url: ['', [Validators.required]],
    location: ['', [Validators.required]],
    started_at: [null as Date | null, [Validators.required]],
    ended_at: [null as Date | null, [Validators.required]],
    invite_days_before: [null as number | null],
    invite_expire_days: [null as number | null],
    invite_send_at: [null as Date | null, [Validators.required]],
    invite_expire_at: [null as Date | null, [Validators.required]],
    is_public: [EStatus.active],
    status: [EStatus.active],
    reminders: this.formBuilder.array([]),
  });

  reminderForm = this.formBuilder.group({
    id: [null as number | null],
    reminder_days_before: [null as number | null],
    reminder_expire_days: [null as number | null],
    reminder_sent_at: [null as Date | null, [Validators.required]],
    reminder_expire_at: [null as Date | null, [Validators.required]],
  });

  disabled: boolean = false;

  @ViewChild('imageUpload') imageUpload?: UploadComponent;

  constructor(
    injector: Injector,
    private readonly formBuilder: FormBuilder,
    private readonly eventService: EventService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    if (this.id) {
      this.eventService.getById(this.id).subscribe({
        next: data => {
          const reminders = data.reminders;

          this.validateForm.patchValue({
            ...data,
            is_public: data.is_public ? EStatus.active : EStatus.inactive,
          });

          if (reminders.length) {
            const _formArray = reminders.map(reminder => {
              const formClone = cloneDeep(this.reminderForm);

              formClone.patchValue({ ...reminder });
              return formClone;
            });

            _formArray.forEach(formArray => this.reminders.push(formArray));
          }

          if (dayjs(this.validateForm.value.invite_send_at).diff() <= 0) {
            this.validateForm.disable();
            this.validateForm.get('status')?.enable();
            this.validateForm.get('content')?.enable();
            this.validateForm.get('image_url')?.enable();
            this.disabled = true;
          }
        },
      });
    }
  }

  get id(): number {
    return parseInt(this.getRouteParam('id'));
  }

  get reminders() {
    return this.validateForm.controls['reminders'] as FormArray;
  }

  get event() {
    return <CreateEvent>this.validateForm.value;
  }

  onBlurSendTimeSetting() {
    const inviteDaysBefore = this.validateForm.value.invite_days_before;
    if (inviteDaysBefore) {
      const startedAt = this.validateForm.value.started_at;
      const startEventDate = dayjs(startedAt);

      this.validateForm.patchValue({
        invite_send_at: startEventDate.add(-inviteDaysBefore, 'days').toDate(),
      });
    }
  }

  onBlurSendTimeAt(panelStatus: boolean) {
    const inviteSendAt = this.validateForm.value.invite_send_at;
    if (inviteSendAt && !panelStatus) {
      const startEventDate = dayjs(this.validateForm.value.started_at);
      const inviteSendDate = dayjs(inviteSendAt);

      const invite_days_before$ =
        -inviteSendDate.diff(startEventDate, 'days') || 1;

      if (invite_days_before$ === 1)
        this.validateForm.patchValue({
          invite_send_at: startEventDate
            .add(-invite_days_before$, 'days')
            .toDate(),
        });

      this.validateForm.patchValue({
        invite_days_before: invite_days_before$,
      });
    }
  }

  onBlurExpiredTimeSetting() {
    const expireDayBefore = this.validateForm.value.invite_expire_days;
    if (expireDayBefore) {
      const sendingTime = this.validateForm.value.invite_send_at;
      const sendingTimeDate = dayjs(sendingTime);

      this.validateForm.patchValue({
        invite_expire_at: sendingTimeDate.add(expireDayBefore, 'days').toDate(),
      });
    }
  }

  onBlurExpiredTimeAt(panelStatus: boolean) {
    const inviteExpireAt = this.validateForm.value.invite_expire_at;
    if (inviteExpireAt && !panelStatus) {
      const sendTimeDate = dayjs(this.validateForm.value.invite_send_at);
      const expireDate = dayjs(inviteExpireAt);

      const invite_expire_days$ = expireDate.diff(sendTimeDate, 'days') || 1;

      if (invite_expire_days$ === 1)
        this.validateForm.patchValue({
          invite_expire_at: sendTimeDate
            .add(invite_expire_days$, 'days')
            .toDate(),
        });

      this.validateForm.patchValue({
        invite_expire_days: invite_expire_days$,
      });
    }
  }

  getGroup(index: number) {
    return this.reminders.at(index) as FormGroup;
  }

  addReminder() {
    const formClone = cloneDeep(this.reminderForm);
    this.reminders.push(formClone);
  }

  deleteReminder(index: number) {
    this.reminders.removeAt(index);
  }

  goBack() {
    this.redirect('/events');
  }

  async save() {
    const url = await this.imageUpload?.uploadImage();

    this.validateForm.patchValue({
      image_url: url || '',
    });

    if (this.validateForm.valid) {
      const body = {
        id: this.id,
        ...this.validateForm.getRawValue(),
        status: this.validateForm.value.status
          ? EStatus.active
          : EStatus.inactive,
        is_public: this.validateForm.value.is_public
          ? EStatus.active
          : EStatus.inactive,
      } as unknown as CreateEvent as EditEvent;
      this._handleSubmitForm(body, this.id);
    } else {
      this.validateFormGroup(this.validateForm);
    }
  }

  onBlurInviteDaysBefore() {
    const inviteDaysBefore = this.validateForm.get('invite_days_before')?.value;
    const eventStartDate = this.validateForm.get('started_at')?.value;
    if (inviteDaysBefore && eventStartDate) {
      const startEventDate = dayjs(eventStartDate);
      this.updateInviteSendAt(
        startEventDate.add(inviteDaysBefore, 'day').toDate()
      );
    }
  }

  onBlurInviteSendAt() {
    const inviteSendAt = this.validateForm.get('invite_send_at')?.value;
    if (inviteSendAt) {
      const eventStartDate = this.validateForm.get('started_at')?.value;
      if (eventStartDate) {
        const startEventDate = dayjs(eventStartDate);
        const sendDate = dayjs(inviteSendAt);
        this.updateInviteDaysBefore(sendDate.diff(startEventDate, 'day'));
      }
    }
  }

  onBlurInviteExpireDays() {
    const inviteExpireDays = this.validateForm.get('invite_expire_days')?.value;
    const inviteSendAt = this.validateForm.get('invite_send_at')?.value;
    if (inviteExpireDays && inviteSendAt) {
      const sendDate = dayjs(inviteSendAt);
      this.updateInviteExpireAt(sendDate.add(inviteExpireDays, 'day').toDate());
    }
  }

  onBlurInviteExpireAt() {
    const inviteExpireAt = this.validateForm.get('invite_expire_at')?.value;
    if (inviteExpireAt) {
      const inviteSendAt = this.validateForm.get('invite_send_at')?.value;
      if (inviteSendAt) {
        const sendDate = dayjs(inviteSendAt);
        const expireDate = dayjs(inviteExpireAt);
        this.updateInviteExpireDays(expireDate.diff(sendDate, 'day'));
      }
    }
  }

  private updateInviteSendAt(date: Date) {
    this.validateForm.patchValue({ invite_send_at: date });
  }

  private updateInviteDaysBefore(value: number) {
    this.validateForm.patchValue({ invite_days_before: value });
  }

  private updateInviteExpireAt(date: Date) {
    this.validateForm.patchValue({ invite_expire_at: date });
  }

  private updateInviteExpireDays(value: number) {
    this.validateForm.patchValue({ invite_expire_days: value });
  }

  private _handleSubmitForm(body: CreateEvent | EditEvent, id?: number): void {
    if (id) {
      this.eventService.update(<EditEvent>body).subscribe(() => {
        this.msgService.success('The event  has been changed successfully');
        this.goBack();
      });
    } else {
      this.eventService.create(<CreateEvent>body).subscribe(() => {
        this.msgService.success('The new event  has been created successfully');
        this.goBack();
      });
    }
  }

  // demo form question config
  // isVisible = true;
  // vm: QuestionFormData | null = null;
}
