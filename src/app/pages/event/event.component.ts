import { Component, Injector, OnInit } from '@angular/core';
import {
  TableAction,
  TableDataType,
  TableHeader,
} from '@components/data-table/data-table.component';
import { EventService } from '@services/event.service';
import { AppBaseComponent } from '@shared/app.base.component';
import { EStatus } from '@shared/constant/enum';
import { Dictionary, ListPaginate } from '@shared/types/base';
import { isEmpty } from 'lodash';
import { debounceTime, Subject } from 'rxjs';

import {
  ActionBarCustomAction,
  ActionBarFilter,
} from '@/app/shared/components/action-bar/action-bar.component';
import { EventDto, QueryEvent } from '@/app/shared/types/event';
import { getNumber } from '@/app/shared/utils/common-helper';

@Component({
  templateUrl: './event.component.html',
})
export class EventComponent extends AppBaseComponent implements OnInit {
  isVisible: boolean = false;
  modalContent = '';

  filters: ActionBarFilter[] = [
    {
      name: 'filter',
      type: 'search',
      placeholder: 'Search (name, code)',
      size: 3,
      value: this.getQueryParam('filter'),
    },
    {
      name: 'date_range',
      type: 'date-range',
      format: 'YYYY-MM-dd HH:mm',
      placeholder: 'Start Time',
      size: 3,
      value: this.getAllQueryParam<Date>('date_range'),
    },
    {
      name: 'is_public',
      type: 'select',
      placeholder: 'Public Event',
      size: 3,
      options: [
        { label: 'Active', value: EStatus.active },
        { label: 'Inactive', value: EStatus.inactive },
      ],
      value: getNumber(this.getQueryParam('is_public')),
    },
  ];

  actions: ActionBarCustomAction[] = [
    {
      label: 'Create',
      icon: 'plus',
      permission: 'event_manage_create',
      act: () => {
        this.redirect('create');
      },
    },
  ];

  headers: TableHeader[] = [];

  editAction: TableAction = {
    permission: 'event_manage_update',
    act: id => {
      this.redirect(`edit/${id}`);
    },
  };

  dataSource: ListPaginate<EventDto> | undefined = undefined;

  private _queryParams: QueryEvent = {
    filter: this.getQueryParam('filter'),
    page: this.getQueryParam<number>('page') || 1,
    limit: this.getQueryParam<number>('limit') || 10,
    is_public: getNumber(this.getQueryParam('is_public')),
    date_range: this.getAllQueryParam<Date>('date_range'),
  };

  protected readonly queryParams$: Subject<QueryEvent> =
    new Subject<QueryEvent>();

  constructor(
    injector: Injector,
    private readonly eventService: EventService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.queryParams$.pipe(debounceTime(300)).subscribe(query => {
      this._handleFilterChange(query);
    });

    this.activeRoute.queryParams.subscribe(() => {
      this.getDataSource();
    });
  }

  getDataSource(): void {
    const query = { ...this._queryParams };

    if (!isEmpty(query.date_range)) {
      query.date_from = query.date_range?.[0];
      query.date_to = query.date_range?.[1];
    }

    this.eventService.getByPaged(query).subscribe(data => {
      const events = data.data;

      const headers: TableHeader[] = [
        {
          label: 'Created',
          key: 'created_at',
          type: TableDataType.date_time,
        },
        {
          label: 'Event Code',
          key: 'code',
          type: TableDataType.text,
        },
        {
          label: 'Event Name',
          key: 'name',
          type: TableDataType.text,
        },
        {
          label: 'Start Time',
          key: 'started_at',
          type: TableDataType.date_time,
        },
        {
          label: 'End Time',
          key: 'ended_at',
          type: TableDataType.date_time,
        },
        {
          label: 'Event Introduction',
          key: 'content',
          type: TableDataType.button,
          icon: 'ng-zorro:document',
          act: (id: string | number, data?: Dictionary) => {
            if (data && data['content']) {
              this.showModal(data as EventDto);
            }
          },
          hide: () => false,
        },
        {
          label: 'Invitation List',
          key: 'guest',
          type: TableDataType.button,
          icon: 'eye',
          act: (id: string | number, data?: Dictionary) => {
            if (id && data) {
              this.redirect('event-guest', { event_id: id }, false);
            }
          },
          hide: () => !this.hasPermission('event_guest_manage_read'),
        },
        {
          label: 'Sending Invitation Time',
          key: 'invite_send_at',
          type: TableDataType.date_time,
        },
        {
          label: 'Expired Invitation Time',
          key: 'invite_expire_at',
          type: TableDataType.date_time,
        },
        {
          label: 'Status',
          key: 'status',
          type: TableDataType.switch,
          act: id => {
            this.eventService.toggle(+id).subscribe(() => {
              this.msgService.success('Update status successful!');
            });
          },
          disable: () => !this.hasPermission('event_manage_update'),
        },
        {
          label: 'Public',
          key: 'is_public',
          type: TableDataType.switch,
          act: id => {
            this.eventService.toggle(+id, 'public').subscribe(() => {
              this.msgService.success('Update public status successful!');
            });
          },
          disable: () => !this.hasPermission('event_manage_update'),
        },
      ];

      let maxReminders = 0;
      const reminderHeaders: TableHeader[] = [];

      events.forEach(event => {
        const remindersCount = event.reminders.length;

        if (remindersCount > maxReminders) {
          maxReminders = remindersCount;

          reminderHeaders.length = 0;

          for (let i = 0; i < remindersCount; i++) {
            reminderHeaders.push(
              ...[
                {
                  label: `Time sending reminder letter ${i + 1}`,
                  key: `reminders[${i}].reminder_sent_at`,
                  type: TableDataType.date_time,
                },
                {
                  label: `Time expired reminder letter ${i + 1}`,
                  key: `reminders[${i}].reminder_expire_at`,
                  type: TableDataType.date_time,
                },
              ]
            );
          }
        }
      });

      this.headers = [
        ...headers.slice(0, 9),
        ...reminderHeaders,
        ...headers.slice(9),
      ];

      this.dataSource = data;
    });
  }

  showModal(data: EventDto): void {
    this.modalContent = data?.content ?? '';
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  private _handleFilterChange(query: QueryEvent): void {
    const tmp: QueryEvent = {
      ...this._queryParams,
      ...query,
    };

    if (!this.compareObject(tmp, this._queryParams)) {
      this._queryParams = {
        ...tmp,
      };

      this.setQueryParam(this._queryParams);
    }
  }
}
