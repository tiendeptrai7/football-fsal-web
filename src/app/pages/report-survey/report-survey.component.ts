import { Component, Injector, OnInit } from '@angular/core';
import {
  TableDataType,
  TableHeader,
} from '@components/data-table/data-table.component';
import { AppBaseComponent } from '@shared/app.base.component';
import { EStatus } from '@shared/constant/enum';
import { Dictionary, ListPaginate } from '@shared/types/base';
import { isEmpty } from 'lodash';
import { debounceTime, Subject } from 'rxjs';

import { ActionBarFilter } from '@/app/shared/components/action-bar/action-bar.component';
import { ReportSurveyService } from '@/app/shared/services/survey-report.service';
import {
  QuerySurveyReportDto,
  SurveyReportDto,
} from '@/app/shared/types/survey-report';
import { getNumber } from '@/app/shared/utils/common-helper';

@Component({
  templateUrl: './report-survey.component.html',
})
export class ReportSurveyComponent extends AppBaseComponent implements OnInit {
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
      format: 'dd/MM/YYYY',
      placeholder: 'Create time',
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
        { label: 'Deactive', value: EStatus.inactive },
      ],
      value: getNumber(this.getQueryParam('status')),
    },
  ];

  headers: TableHeader[] = [
    {
      label: 'Create Time',
      key: 'created_at',
      type: TableDataType.date,
      sortable: true,
    },
    {
      label: 'Survey Code',
      key: 'code',
      type: TableDataType.text,
      sortable: true,
    },
    {
      label: 'Survey Name',
      key: 'name',
      type: TableDataType.text,
      sortable: true,
    },
    {
      label: 'QR Code',
      key: '',
      type: TableDataType.button,
      icon: 'download',
      hide: () => !this.hasPermission('survey_report_manage_read'),
    },
    {
      label: 'Status',
      key: 'status',
      type: TableDataType.render,
      render: (data: Dictionary) => {
        const tmp = data as SurveyReportDto;
        if (tmp?.status === EStatus.active) {
          return '<span class="p-1 rounded badge bg-success">Active</span>';
        }
        return '<span class="p-1 rounded badge bg-draft">Deactive</span>';
      },
    },
    {
      label: 'Participant Total',
      key: 'event_guest_total',
      type: TableDataType.text,
      sortable: true,
    },
    {
      label: 'Show Participant',
      key: '',
      type: TableDataType.button,
      icon: 'eye',
      act: (id: string | number, data?: Dictionary) => {
        if (id && data) {
          this.redirect('participant-list', { survey_id: id });
        }
      },
      hide: () => !this.hasPermission('survey_report_manage_read'),
    },
    {
      label: 'Result Chart',
      key: '',
      type: TableDataType.button,
      icon: 'area-chart',
      act: (id: string | number, data?: Dictionary) => {
        if (id && data) {
          this.redirect('results', { survey_id: id });
        }
      },
      hide: () => !this.hasPermission('survey_report_manage_read'),
    },
  ];

  dataSource: ListPaginate<SurveyReportDto> | undefined = undefined;

  private _queryParams: QuerySurveyReportDto = {
    filter: this.getQueryParam('filter'),
    page: this.getQueryParam<number>('page') || 1,
    limit: this.getQueryParam<number>('limit') || 10,
    sorting: this.getQueryParam('sorting'),
    date_range: this.getAllQueryParam<Date>('date_range'),
  };

  protected readonly queryParams$: Subject<QuerySurveyReportDto> =
    new Subject<QuerySurveyReportDto>();

  constructor(
    injector: Injector,
    private readonly reportSurveyService: ReportSurveyService
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

    this.reportSurveyService.getByPaged(query).subscribe(data => {
      this.dataSource = data;
    });
  }

  edit(id: string | number): void {
    this.redirect(`edit/${id}`);
  }

  private _handleFilterChange(query: QuerySurveyReportDto): void {
    const tmp: QuerySurveyReportDto = {
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
