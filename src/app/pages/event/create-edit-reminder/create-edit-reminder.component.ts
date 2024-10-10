import { Component, Injector, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import dayjs from 'dayjs';

import { AppBaseComponent } from '@/app/shared/app.base.component';
import { CreateEvent } from '@/app/shared/types/event';

@Component({
  selector: 'app-create-edit-reminder',
  templateUrl: './create-edit-reminder.component.html',
})
export class CreateEditReminderComponent extends AppBaseComponent {
  @Input()
  event?: CreateEvent;
  @Input()
  formGroup!: FormGroup;
  @Input()
  disabled: boolean = false;

  constructor(injector: Injector) {
    super(injector);
  }

  onBlurSendTimeSetting() {
    const sendDayBefore = this.formGroup.value.reminder_days_before;
    if (sendDayBefore) {
      const startedAt = this.event?.started_at;
      const startEventDate = dayjs(startedAt);

      this.formGroup.patchValue({
        reminder_sent_at: startEventDate.add(-sendDayBefore, 'days').toDate(),
      });
    }
  }

  onBlurSendTimeAt(panelStatus: boolean) {
    const reminder_sent_at = this.formGroup.get('reminder_sent_at')?.value;
    if (reminder_sent_at && !panelStatus) {
      const startEventDate = dayjs(this.event?.started_at);
      const reminderSentDate = dayjs(reminder_sent_at);

      const reminder_days_before$ = reminderSentDate.diff(
        startEventDate,
        'days'
      );

      if (!reminder_days_before$) {
        this.formGroup.patchValue({
          reminder_days_before: 1,
          reminder_sent_at: reminderSentDate.add(-1, 'days').toDate(),
        });
      } else {
        this.formGroup.patchValue({
          reminder_days_before: -reminder_days_before$,
        });
      }
    }
  }

  onBlurExpiredTimeSetting() {
    const reminder_expire_days = this.formGroup.get(
      'reminder_expire_days'
    )?.value;
    if (reminder_expire_days) {
      const reminderSentDate = dayjs(
        this.formGroup.get('reminder_sent_at')?.value
      );

      this.formGroup.patchValue({
        reminder_expire_at: reminderSentDate
          .add(reminder_expire_days, 'days')
          .toDate(),
      });
    }
  }

  onBlurExpiredTimeAt(panelStatus: boolean) {
    const reminder_expire_at = this.formGroup.get('reminder_expire_at')?.value;
    if (reminder_expire_at && !panelStatus) {
      const reminderSentDate = dayjs(
        this.formGroup.get('reminder_sent_at')?.value
      );
      const reminderExpireDate = dayjs(reminder_expire_at);

      const reminder_expire_day$ = reminderExpireDate.diff(
        reminderSentDate,
        'days'
      );

      if (!reminder_expire_day$) {
        this.formGroup.patchValue({
          reminder_expire_days: reminder_expire_day$ + 1,
          reminder_expire_at: reminderExpireDate
            .add(reminder_expire_day$ + 1, 'days')
            .toDate(),
        });
      } else {
        this.formGroup.patchValue({
          reminder_expire_days: reminder_expire_day$,
        });
      }
    }
  }
}
