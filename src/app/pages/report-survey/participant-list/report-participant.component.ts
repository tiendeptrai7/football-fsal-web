import { Component, Injector, OnInit } from '@angular/core';
import {
  TableDataType,
  TableHeader,
} from '@components/data-table/data-table.component';
import { AppBaseComponent } from '@shared/app.base.component';
import { EStatus } from '@shared/constant/enum';
import { Dictionary, ListPaginate } from '@shared/types/base';
import { debounceTime, Subject } from 'rxjs';

import {
  ActionBarCustomAction,
  ActionBarFilter,
} from '@/app/shared/components/action-bar/action-bar.component';
import { AzureStorageService } from '@/app/shared/services/azure-storage.service';
import { SurveyService } from '@/app/shared/services/survey.service';
import { ReportSurveyService } from '@/app/shared/services/survey-report.service';
import { SurveyDto } from '@/app/shared/types/survey';
import {
  ParticipantReportDto,
  QueryParticipantReportDto,
} from '@/app/shared/types/survey-report';
import { getNumber } from '@/app/shared/utils/common-helper';

@Component({
  templateUrl: './report-participant.component.html',
})
export class ReportPariticipantComponent
  extends AppBaseComponent
  implements OnInit
{
  filters: ActionBarFilter[] = [
    {
      name: 'filter',
      type: 'search',
      placeholder: 'Search',
      size: 3,
      value: this.getQueryParam('filter'),
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
      label: 'HCP ID',
      key: 'hcp.id',
      type: TableDataType.text,
      sortable: true,
    },
    {
      label: 'HCP Name',
      key: 'hcp.name',
      type: TableDataType.text,
      sortable: true,
    },
    {
      label: 'Participant Time',
      key: 'created_at',
      type: TableDataType.date_time,
      sortable: true,
    },
    {
      label: 'Submitted Time',
      key: 'submit_time',
      type: TableDataType.date_time,
      sortable: true,
    },
    {
      label: 'Status',
      key: 'status',
      type: TableDataType.render,
      render: (data: Dictionary) => {
        const tmp = data as ParticipantReportDto;
        if (tmp?.submit_status === EStatus.active) {
          return '<span class="p-1 rounded badge bg-success">Submitted</span>';
        }
        return '<span class="p-1 rounded badge bg-draft">No Action</span>';
      },
    },
    {
      label: 'Result',
      key: '',
      type: TableDataType.button,
      icon: 'eye',
      hide: () => !this.hasPermission('survey_report_manage_read'),
    },
  ];

  actions: ActionBarCustomAction[] = [
    {
      label: 'Export',
      icon: 'plus',
      permission: 'survey_report_manage_export',
      act: () => {
        this.export();
      },
    },
  ];

  dataSource: ListPaginate<ParticipantReportDto> | undefined = undefined;
  survey: SurveyDto | null = null;

  private _queryParams: QueryParticipantReportDto = {
    filter: this.getQueryParam('filter'),
    page: this.getQueryParam<number>('page') || 1,
    limit: this.getQueryParam<number>('limit') || 10,
    sorting: this.getQueryParam('sorting'),
    survey_id: this.getQueryParam<number>('survey_id'),
  };

  protected readonly queryParams$: Subject<QueryParticipantReportDto> =
    new Subject<QueryParticipantReportDto>();

  constructor(
    injector: Injector,
    private readonly reportSurveyService: ReportSurveyService,
    private readonly surveyService: SurveyService,
    private readonly azureStorageService: AzureStorageService
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
    const survey_id = this.getQueryParam<number>('survey_id');
    const query = { ...this._queryParams };
    this.surveyService.getById(survey_id).subscribe({
      next: survey => (this.survey = survey),
    });
    this.reportSurveyService.getParticipants(query).subscribe(data => {
      this.dataSource = data;
    });
  }

  export() {
    this.reportSurveyService.export(this._queryParams).subscribe(data => {
      this.azureStorageService.downloadFile(data?.key, 'Export_Report_Survey');
    });
  }

  private _handleFilterChange(query: QueryParticipantReportDto): void {
    const survey_id = this._queryParams.survey_id;
    const tmp: QueryParticipantReportDto = {
      ...this._queryParams,
      ...query,
      survey_id: survey_id,
    };

    this._queryParams = tmp;
    this.setQueryParam(this._queryParams);
  }
}
