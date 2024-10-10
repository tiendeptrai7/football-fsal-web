import { Component, Injector, OnInit } from '@angular/core';
import { isEmpty } from 'lodash';
import { debounceTime, map, Observable, Subject } from 'rxjs';

import { AppBaseComponent } from '@/app/shared/app.base.component';
import {
  ActionBarCustomAction,
  ActionBarFilter,
} from '@/app/shared/components/action-bar/action-bar.component';
import {
  TableAction,
  TableDataType,
  TableHeader,
} from '@/app/shared/components/data-table/data-table.component';
import { SelectOption } from '@/app/shared/components/lazy-select/lazy-select.component';
import { EStatus } from '@/app/shared/constant/enum';
import { EventService } from '@/app/shared/services/event.service';
import { RecapService } from '@/app/shared/services/recap.service';
import { BaseQuery, ListPaginate } from '@/app/shared/types/base';
import { QueryRecap, RecapDto } from '@/app/shared/types/recap';
import { getNumber } from '@/app/shared/utils/common-helper';

@Component({
  selector: 'app-recap',
  templateUrl: './recap.component.html',
})
export class RecapComponent extends AppBaseComponent implements OnInit {
  filters: ActionBarFilter[] = [
    {
      name: 'filter',
      type: 'search',
      placeholder: 'Search (Name, Code)',
      size: 3,
      value: this.getQueryParam('filter'),
    },
    {
      name: 'event_id',
      type: 'lazy-select',
      placeholder: 'Event',
      size: 3,
      value: this.getQueryParam('event_id'),
      lazyDataSource: (params: BaseQuery): Observable<SelectOption[]> =>
        this.eventService.getByPaged(params).pipe(
          map(
            response =>
              response.data.map(value => ({
                label: value.name,
                value: value.id,
              })) as SelectOption[]
          )
        ),
    },
    {
      name: 'date_range',
      type: 'date-range',
      format: 'YYYY-MM-dd HH:mm',
      placeholder: 'Sending Time',
      size: 3,
      value: this.getAllQueryParam<Date>('date_range'),
    },
    {
      name: 'status',
      type: 'select',
      placeholder: 'Status',
      size: 3,
      options: [
        { label: 'Active', value: EStatus.active },
        { label: 'Inactive', value: EStatus.inactive },
      ],
      value: getNumber(this.getQueryParam('status')),
    },
  ];

  actions: ActionBarCustomAction[] = [
    {
      label: 'Create',
      icon: 'plus',
      permission: 'recap_manage_create',
      act: () => {
        this.redirect('create');
      },
    },
  ];

  headers: TableHeader[] = [
    {
      label: 'Created Time',
      key: 'created_at',
      type: TableDataType.date_time,
    },
    {
      label: 'Event Name',
      key: 'event.name',
      type: TableDataType.text,
    },
    {
      label: 'Re-cap Code',
      key: 'code',
      type: TableDataType.text,
    },
    {
      label: 'Re-cap Name',
      key: 'name',
      type: TableDataType.text,
    },
    {
      label: 'Sending Time',
      key: 'recap_sent_at',
      type: TableDataType.date_time,
    },
    {
      label: 'Status',
      key: 'status',
      type: TableDataType.switch,
      act: id => {
        this.recapService.toggle(+id).subscribe(() => {
          this.msgService.success('Update status successful!');
        });
      },
      disable: () => !this.hasPermission('recap_manage_update'),
    },
  ];

  editAction: TableAction = {
    permission: 'recap_manage_update',
    act: id => {
      this.redirect(`edit/${id}`);
    },
  };

  dataSource?: ListPaginate<RecapDto>;

  private _queryParams: QueryRecap = {
    filter: this.getQueryParam('filter'),
    page: this.getQueryParam<number>('page') || 1,
    limit: this.getQueryParam<number>('limit') || 10,
    sorting: this.getQueryParam('sorting'),
    status: getNumber(this.getQueryParam('status')),
    date_range: this.getAllQueryParam<Date>('date_range'),
    event_id: getNumber(this.getQueryParam('event_id')),
  };

  protected readonly queryParams$: Subject<QueryRecap> =
    new Subject<QueryRecap>();

  constructor(
    injector: Injector,
    private readonly eventService: EventService,
    private readonly recapService: RecapService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.queryParams$.pipe(debounceTime(300)).subscribe(query => {
      this._handleFilterChange(query);
    });
    this.activeRoute.queryParams.subscribe(() => {
      this.loadData();
    });
  }

  loadData(): void {
    const query = { ...this._queryParams };

    if (!isEmpty(this._queryParams.date_range)) {
      query.date_from = this._queryParams.date_range?.[0];
      query.date_to = this._queryParams.date_range?.[1];
    }

    this.recapService.getByPaged(query).subscribe({
      next: data => (this.dataSource = data),
    });
  }

  private _handleFilterChange(query: QueryRecap): void {
    const tmp: QueryRecap = {
      ...this._queryParams,
      ...query,
    };

    if (!this.compareObject(tmp, this._queryParams)) {
      this._queryParams = {
        ...tmp,
      };

      this.setQueryParam(this._queryParams);
    } else {
      this.loadData();
    }
  }
}
