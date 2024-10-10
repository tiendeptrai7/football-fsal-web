import { Component, Injector, OnInit } from '@angular/core';
import {
  TableAction,
  TableDataType,
  TableHeader,
} from '@components/data-table/data-table.component';
import { NewsService } from '@services/news.service';
import { AppBaseComponent } from '@shared/app.base.component';
import { EStatus } from '@shared/constant/enum';
import { Dictionary, ListPaginate } from '@shared/types/base';
import { isEmpty } from 'lodash';
import { debounceTime, Subject } from 'rxjs';

import {
  ActionBarCustomAction,
  ActionBarFilter,
} from '@/app/shared/components/action-bar/action-bar.component';
import { NewsDto, QueryNews } from '@/app/shared/types/news';
import { getNumber } from '@/app/shared/utils/common-helper';

@Component({
  templateUrl: './news.component.html',
})
export class NewsComponent extends AppBaseComponent implements OnInit {
  filters: ActionBarFilter[] = [
    {
      name: 'filter',
      type: 'search',
      placeholder: 'Search (Title, Code)',
      size: 3,
      value: this.getQueryParam<string>('filter'),
    },
    {
      name: 'date_range',
      type: 'date-range',
      format: 'YYYY-MM-dd HH:mm',
      placeholder: 'Published Time',
      size: 3,
      value: this.getAllQueryParam<Date>('date_range'),
    },
    {
      name: 'status',
      type: 'select',
      placeholder: 'Stage',
      size: 3,
      options: [
        { label: 'Published', value: EStatus.active },
        { label: 'Draft', value: EStatus.inactive },
        { label: 'Schedule', value: EStatus.pending },
      ],
      value: getNumber(this.getQueryParam('status')),
    },
  ];

  actions: ActionBarCustomAction[] = [
    {
      label: 'Create',
      icon: 'plus',
      permission: 'news_manage_create',
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
      label: 'News Code',
      key: 'code',
      type: TableDataType.text,
    },
    {
      label: 'Title',
      key: 'title',
      type: TableDataType.text,
    },
    {
      label: 'Stage',
      key: 'status',
      type: TableDataType.render,
      render: (data: Dictionary) => {
        const tmp = data as NewsDto;
        if (tmp?.status === EStatus.active && tmp?.published_at) {
          if (new Date(tmp?.published_at) <= new Date()) {
            return '<span class="p-1 rounded badge bg-success">Published</span>';
          }
          return '<span class="p-1 rounded badge bg-processing">Schedule</span>';
        }
        return '<span class="p-1 rounded badge bg-draft">Save Draft</span>';
      },
    },
    {
      label: 'Status',
      key: 'status',
      type: TableDataType.switch,
      act: id => {
        this.newsService.toggle(+id).subscribe(() => {
          this.msgService.success('Update status successful!');
        });
      },
      disable: () => !this.hasPermission('news_manage_update'),
    },
    {
      label: 'View',
      key: 'view',
      type: TableDataType.text,
    },
    {
      label: 'Publish At',
      key: 'published_at',
      type: TableDataType.date_time,
    },
  ];

  dataSource?: ListPaginate<NewsDto>;

  editAction: TableAction = {
    permission: 'news_manage_update',
    act: id => this.redirect(`edit/${id}`),
  };

  private _queryParams: QueryNews = {
    filter: this.getQueryParam('filter'),
    page: this.getQueryParam<number>('page') || 1,
    limit: this.getQueryParam<number>('limit') || 10,
    sorting: this.getQueryParam('sorting'),
    status: getNumber(this.getQueryParam('status')),
    date_range: this.getAllQueryParam<Date>('date_range'),
  };

  protected readonly queryParams$: Subject<QueryNews> =
    new Subject<QueryNews>();

  constructor(
    injector: Injector,
    private readonly newsService: NewsService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.queryParams$
      .pipe(debounceTime(300))
      .subscribe(query => this._handleFilterChange(query));

    this.activeRoute.queryParams.subscribe(() => this.getDataSource());
  }

  getDataSource(): void {
    const query = { ...this._queryParams };

    if (!isEmpty(query.date_range)) {
      query.date_from = query.date_range?.[0];
      query.date_to = query.date_range?.[1];
    }

    this.newsService.getByPaged(query).subscribe(data => {
      this.dataSource = data;
    });
  }

  private _handleFilterChange(query: QueryNews): void {
    const tmp: QueryNews = {
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
