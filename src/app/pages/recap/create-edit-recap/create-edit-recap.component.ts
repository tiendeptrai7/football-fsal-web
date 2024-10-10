import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { find, isEmpty } from 'lodash';
import { map, Subscription } from 'rxjs';

import { AppBaseComponent } from '@/app/shared/app.base.component';
import {
  LazySelectDataSource,
  SelectOption,
} from '@/app/shared/components/lazy-select/lazy-select.component';
import { EStatus } from '@/app/shared/constant/enum';
import { EventService } from '@/app/shared/services/event.service';
import { RecapService } from '@/app/shared/services/recap.service';
import { EventDto } from '@/app/shared/types/event';
import { CreateRecap, QueryRecap, UpdateRecap } from '@/app/shared/types/recap';

@Component({
  selector: 'app-create-edit-recap',
  templateUrl: './create-edit-recap.component.html',
})
export class CreateEditRecapComponent
  extends AppBaseComponent
  implements OnInit, OnDestroy
{
  validateForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    event_id: [null as number | null, [Validators.required]],
    recap_days_before: [{ value: null as number | null, disabled: true }],
    recap_sent_at: [
      { value: null as Date | null, disabled: true },
      [Validators.required],
    ],
    content: ['', [Validators.required]],
    status: [EStatus.active],
  });

  eventList: EventDto[] = [];

  lazyEventSource!: LazySelectDataSource;

  private subscription: Subscription[] = [];

  constructor(
    injector: Injector,
    private readonly formBuilder: FormBuilder,
    private readonly eventService: EventService,
    private readonly recapService: RecapService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.setupControlSubscription();

    if (this.id) {
      this.recapService.getById(this.id).subscribe({
        next: data => {
          this.validateForm.patchValue({
            ...data,
            status: data.status ? EStatus.active : EStatus.inactive,
          });

          this.disableForm();
        },
      });
    } else {
      this.disableForm();
    }

    this.lazyEventSource = (params: QueryRecap) => {
      const _params = {
        ...params,
        status: EStatus.active,
      };
      return this.eventService.getByPaged(_params).pipe(
        map(data => {
          const listData = data.data;

          this.eventList = [...this.eventList, ...listData];

          return listData.map(event => ({
            label: `${event.name} (${dayjs(event?.started_at).format('YYYY-MM-dd HH:mm')} - ${dayjs(event?.ended_at).format('YYYY-MM-dd HH:mm')})`,
            value: event.id,
          })) as SelectOption[];
        })
      );
    };
  }

  ngOnDestroy(): void {
    if (!isEmpty(this.subscription))
      this.subscription.forEach(value => value.unsubscribe);
  }

  get id(): number {
    return this.getRouteParam<number>('id');
  }

  get event(): EventDto | null {
    if (this.validateForm.get('event_id')?.value) {
      return find(this.eventList, {
        id: this.validateForm.get('event_id')?.value,
      }) as EventDto;
    }

    return null;
  }

  onBlurSendTimeSetting() {
    const recapDayBefore = this.validateForm.get('recap_days_before')?.value;
    if (recapDayBefore) {
      const event = this.event;
      const startEventDate = dayjs(event?.started_at);

      this.validateForm.patchValue({
        recap_sent_at: startEventDate.add(recapDayBefore, 'days').toDate(),
      });
    }
  }

  onBlurSendTimeAt(panelStatus: boolean) {
    const recap_sent_at = this.validateForm.get('recap_sent_at')?.value;
    if (recap_sent_at && !panelStatus) {
      const event = this.event;
      const startEventDate = dayjs(event?.started_at);
      const reminderSentDate = dayjs(recap_sent_at);

      const recap_days_before$ = reminderSentDate.diff(startEventDate, 'days');

      if (!recap_days_before$) {
        this.validateForm.patchValue({
          recap_days_before: 1,
          recap_sent_at: reminderSentDate.add(1, 'days').toDate(),
        });
      } else {
        this.validateForm.patchValue({
          recap_days_before: recap_days_before$,
        });
      }
    }
  }

  goBack() {
    this.redirect('/recaps');
  }

  save() {
    if (this.validateForm.valid) {
      const body = {
        id: this.id,
        ...this.validateForm.getRawValue(),
        status: this.validateForm.value.status
          ? EStatus.active
          : EStatus.inactive,
      } as unknown as CreateRecap as UpdateRecap;
      this._handleSubmitForm(body, this.id);
    } else {
      this.validateFormGroup(this.validateForm);
    }
  }

  private disableForm(): void {
    if (
      this.id &&
      dayjs().isAfter(this.validateForm.get('recap_sent_at')?.value)
    ) {
      this.validateForm.disable();
      this.validateForm.get('content')?.enable();
    }
  }

  private setupControlSubscription(): void {
    const eventSubscription = this.validateForm
      .get('event_id')
      ?.valueChanges.subscribe(value => {
        if (value) {
          this.validateForm.get('recap_days_before')?.enable();
          this.validateForm.get('recap_sent_at')?.enable();
        }
      });

    if (eventSubscription) this.subscription.push(eventSubscription);
  }

  private _handleSubmitForm(
    body: CreateRecap | UpdateRecap,
    id?: number
  ): void {
    if (id) {
      this.recapService.update(<UpdateRecap>body).subscribe({
        next: () => {
          this.msgService.success('Recap update successful!');
          this.goBack();
        },
      });
    } else {
      this.recapService.create(<CreateRecap>body).subscribe({
        next: () => {
          this.msgService.success('Recap create successful!');
          this.goBack();
        },
      });
    }
  }
}
