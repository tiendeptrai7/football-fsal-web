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
import { EStatus } from '@/app/shared/constant/enum';
import { FeedbackService } from '@/app/shared/services/feedback.service';
import { ListPaginate } from '@/app/shared/types/base';
import { FeedbackDto, QueryFeedbackDto } from '@/app/shared/types/feedback';
import { getNumber } from '@/app/shared/utils/common-helper';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
})
export class FeedbackComponent extends AppBaseComponent implements OnInit {
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
      format: 'yyyy-MM-dd HH:mm:ss',
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
      label: 'Feedback Code',
      key: 'code',
      type: TableDataType.text,
    },
    {
      label: 'Feedback Name',
      key: 'name',
      type: TableDataType.text,
    },
    {
      label: 'Send Time',
      key: 'feedback_send_at',
      type: TableDataType.date_time,
    },
    {
      label: 'Expired Time',
      key: 'feedback_expire_at',
      type: TableDataType.date_time,
    },
    {
      label: 'Status',
      key: 'status',
      type: TableDataType.switch,
      act: id => {
        this.feedbackService.toggle(+id).subscribe(() => {
          this.msgService.success('Update status successful!');
        });
      },
      disable: () => {
        return !this.hasPermission('feedback_manage_update');
      },
    },
  ];

  editAction: TableAction = {
    act: id => {
      this.redirect(`edit/${id}`);
    },
    disable: () => !this.hasPermission('feedback_manage_update'),
  };

  dataSource?: ListPaginate<FeedbackDto>;

  private _queryParams: QueryFeedbackDto = {
    filter: this.getQueryParam('filter'),
    page: this.getQueryParam<number>('page') || 1,
    limit: this.getQueryParam<number>('limit') || 10,
    sorting: this.getQueryParam('sorting'),
    status: this.getQueryParam<number>('status'),
    date_range: this.getAllQueryParam('date_range'),
  };

  protected readonly queryParams$: Subject<QueryFeedbackDto> =
    new Subject<QueryFeedbackDto>();

  constructor(
    injector: Injector,
    private readonly feedbackService: FeedbackService
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

    this.feedbackService
      .getByPaged(query)
      .subscribe(data => (this.dataSource = data));
  }

  private _handleFilterChange(query: QueryFeedbackDto): void {
    const tmp: QueryFeedbackDto = {
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
