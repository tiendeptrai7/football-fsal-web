import { Component, Injector, OnInit } from '@angular/core';
import { isEmpty } from 'lodash';
import { debounceTime, Subject } from 'rxjs';

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
import { EventFormService } from '@/app/shared/services/event-form.service';
import { ListPaginate } from '@/app/shared/types/base';
import { EventFormDto, QueryEventForm } from '@/app/shared/types/event-form';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent extends AppBaseComponent implements OnInit {
  filters: ActionBarFilter[] = [
    {
      name: 'filter',
      type: 'search',
      placeholder: 'Search (code, name)',
      size: 4,
      value: this.getQueryParam('filter'),
    },
    {
      name: 'date_range',
      type: 'date-range',
      format: 'YYYY-MM-dd HH:mm:ss',
      size: 3,
      value: this.getAllQueryParam<Date>('date_range'),
    },
  ];

  actions: ActionBarCustomAction[] = [
    {
      label: 'Create',
      icon: 'plus',
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
      label: 'Form Code',
      key: 'code',
      type: TableDataType.text,
    },
    {
      label: 'Form Name',
      key: 'name',
      type: TableDataType.text,
    },
    {
      label: 'Status',
      key: 'status',
      type: TableDataType.switch,
      act: id => {
        this.eventFormService.toggle(+id).subscribe(() => {
          this.msgService.success('Update status successful!');
        });
      },
      disable: data => {
        return (
          !this.hasPermission('event_form_manage_update') ||
          data?.['code'] === 'Default'
        );
      },
    },
  ];

  editAction: TableAction = {
    act: id => {
      this.redirect(`edit/${id}`);
    },
    disable: data =>
      !this.hasPermission('event_form_manage_update') ||
      data?.['code'] === 'Default',
  };

  otherActions: TableAction[] = [
    {
      icon: 'copy',
      act: id => {
        this.redirect(`clone/${id}`);
      },
      disable: data =>
        !this.hasPermission('event_form_manage_create') ||
        data?.['code'] === 'Default',
    },
  ];

  dataSource?: ListPaginate<EventFormDto>;

  private _queryParams: QueryEventForm = {
    filter: this.getQueryParam('filter'),
    page: this.getQueryParam<number>('page') || 1,
    limit: this.getQueryParam<number>('limit') || 10,
    sorting: this.getQueryParam('sorting'),
    date_range: this.getAllQueryParam('date_range'),
  };

  protected readonly queryParams$: Subject<QueryEventForm> =
    new Subject<QueryEventForm>();

  constructor(
    injector: Injector,
    private readonly eventFormService: EventFormService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.queryParams$
      .pipe(debounceTime(300))
      .subscribe(query => this._handleFilterChange(query));

    this.activeRoute.queryParams.subscribe(() => this.getDataSource());
  }

  private getDataSource(): void {
    const query = { ...this._queryParams };

    if (!isEmpty(query.date_range)) {
      query.date_from = query.date_range?.[0];
      query.date_to = query.date_range?.[1];
    }

    this.eventFormService
      .getByPaged(query)
      .subscribe(data => (this.dataSource = data));
  }

  private _handleFilterChange(query: QueryEventForm): void {
    const tmp: QueryEventForm = {
      ...this._queryParams,
      ...query,
    };

    if (!this.compareObject(tmp, this._queryParams)) {
      this._queryParams = {
        ...tmp,
      };
      this.setQueryParam(this._queryParams);
    } else {
      this.getDataSource();
    }
  }
}
