import { Component, Injector, OnInit } from '@angular/core';
import {
  TableAction,
  TableDataType,
  TableHeader,
} from '@components/data-table/data-table.component';
import { AppBaseComponent } from '@shared/app.base.component';
import { EStatus } from '@shared/constant/enum';
import { ListPaginate } from '@shared/types/base';
import { debounceTime, Subject } from 'rxjs';

import {
  ActionBarCustomAction,
  ActionBarFilter,
} from '@/app/shared/components/action-bar/action-bar.component';
import { SurveyService } from '@/app/shared/services/survey.service';
import { QuerySurveyDto, SurveyDto } from '@/app/shared/types/survey';
import { getNumber, isEmpty } from '@/app/shared/utils/common-helper';

@Component({
  templateUrl: './survey.component.html',
})
export class SurveyComponent extends AppBaseComponent implements OnInit {
  filters: ActionBarFilter[] = [
    {
      name: 'filter',
      type: 'search',
      placeholder: 'Search',
      size: 3,
      value: this.getQueryParam('filter'),
    },
    {
      name: 'date_range',
      type: 'date-range',
      format: 'yyyy-MM-dd',
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
      permission: 'survey_manage_create',
      act: () => {
        this.redirect('create');
      },
    },
  ];

  headers: TableHeader[] = [
    {
      label: 'Create Time',
      key: 'created_at',
      type: TableDataType.date_time,
    },
    {
      label: 'Event Name',
      key: 'event.name',
      type: TableDataType.text,
    },
    {
      label: 'Survey Code',
      key: 'code',
      type: TableDataType.text,
    },
    {
      label: 'Survey Name',
      key: 'name',
      type: TableDataType.text,
    },
    {
      label: 'Duplicate',
      key: '',
      type: TableDataType.button,
      icon: 'copy',
      hide: () => !this.hasPermission('survey_manage_update'),
      act: id => {
        this.redirect(`copy/${id}`);
      },
    },
    {
      label: 'QR Code',
      key: '',
      type: TableDataType.button,
      icon: 'download',
      hide: () => !this.hasPermission('survey_manage_update'),
    },
    {
      label: 'Status',
      key: 'status',
      type: TableDataType.switch,
      act: id => {
        this.surveyService.toggle(+id).subscribe(() => {
          this.msgService.success('Update status successful!');
        });
      },
      disable: () => !this.hasPermission('survey_manage_update'),
    },
  ];

  editAction: TableAction = {
    permission: 'survey_manage_update',
    act: this.editSurvey.bind(this),
  };

  dataSource: ListPaginate<SurveyDto> | undefined = undefined;

  private _queryParams: QuerySurveyDto = {
    filter: this.getQueryParam('filter'),
    page: this.getQueryParam<number>('page') || 1,
    limit: this.getQueryParam<number>('limit') || 10,
    status: getNumber(this.getQueryParam('status')),
    date_range: this.getAllQueryParam<Date>('date_range'),
  };

  protected readonly queryParams$: Subject<QuerySurveyDto> =
    new Subject<QuerySurveyDto>();

  constructor(
    injector: Injector,
    private readonly surveyService: SurveyService
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

    this.surveyService.getByPaged(query).subscribe(data => {
      this.dataSource = data;
    });
  }

  private _handleFilterChange(query: QuerySurveyDto): void {
    const tmp: QuerySurveyDto = {
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

  editSurvey(id: string | number): void {
    this.redirect(`edit/${id}`);
  }
}
