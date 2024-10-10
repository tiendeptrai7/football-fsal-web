import { Component, Injector, OnInit } from '@angular/core';
import { isEmpty } from 'lodash';
import { debounceTime, map, Observable, Subject, tap } from 'rxjs';

import { AppBaseComponent } from '@/app/shared/app.base.component';
import {
  ActionBarCustomAction,
  ActionBarFilter,
} from '@/app/shared/components/action-bar/action-bar.component';
import {
  TableDataType,
  TableHeader,
} from '@/app/shared/components/data-table/data-table.component';
import { SelectOption } from '@/app/shared/components/lazy-select/lazy-select.component';
import { EStatus } from '@/app/shared/constant/enum';
import { AzureStorageService } from '@/app/shared/services/azure-storage.service';
import { ZaloMessageService } from '@/app/shared/services/zalo-message.service';
import { Dictionary, ListPaginate } from '@/app/shared/types/base';
import {
  QueryZaloMessageDto,
  ZaloMessageDto,
} from '@/app/shared/types/zalo-message';
import { getNumber } from '@/app/shared/utils/common-helper';
import { upperCaseFirstLetter } from '@/app/shared/utils/string';

import { ZaloMessageTypeOptions } from './constant/zalo-message.constant';

@Component({
  selector: 'app-zalo-message',
  templateUrl: './zalo-message.component.html',
})
export class ZaloMessageComponent extends AppBaseComponent implements OnInit {
  isVisibleObserve: boolean = false;

  filters: ActionBarFilter[] = [
    {
      name: 'filter',
      type: 'search',
      placeholder: 'Search (Zalo Name, Reply Zalo)',
      size: 3,
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
      name: 'activities',
      type: 'select',
      placeholder: 'Activities',
      size: 3,
      options: [
        { label: 'Response', value: EStatus.active },
        { label: 'Sent', value: EStatus.inactive },
      ],
      value: getNumber(this.getQueryParam('activities')),
    },
    {
      name: 'message_type',
      type: 'select',
      placeholder: 'Message Type',
      size: 3,
      options: ZaloMessageTypeOptions.map(
        (type): SelectOption => ({
          label: upperCaseFirstLetter(type.label),
          value: type.value,
        })
      ),
      value: getNumber(this.getQueryParam('message_type')),
    },
    {
      name: 'observe_by',
      type: 'select-async',
      placeholder: 'Observer',
      size: 3,
      $options: this.zaloMessageService.getObserverList().pipe(
        map((response): SelectOption[] =>
          response.map(
            (observer): SelectOption => ({
              label: observer.observer_name,
              value: observer.observer_id,
            })
          )
        )
      ),
      value: getNumber(this.getQueryParam('observe_by')),
    },
  ];

  actions: ActionBarCustomAction[] = [
    {
      label: 'Observe',
      icon: 'eye',
      act: () => {
        if (!isEmpty(this.messageSelected)) this.openObserveModal();
      },
    },
    {
      label: 'Export',
      icon: 'export',
      act: () => {
        this.export();
      },
    },
  ];

  headers: TableHeader[] = [
    {
      label: 'Time sent',
      key: 'timestamp',
      type: TableDataType.date_time,
    },
    {
      label: 'Zalo ID',
      key: 'from_id',
      type: TableDataType.text,
    },
    {
      label: 'Zalo Name',
      key: 'from_display_name',
      type: TableDataType.text,
    },
    {
      label: 'Activies',
      key: 'from_id',
      type: TableDataType.render,
      render: data => (data?.['from_id'] ? 'Sent' : 'Response'),
    },
    {
      label: 'Reply Zalo',
      key: 'to_display_name',
      type: TableDataType.render,
      render: data => (data?.['to_id'] ? data?.['to_display_name'] : ''),
    },
    {
      label: 'Message type',
      key: 'event_name',
      type: TableDataType.render,
      render: data =>
        upperCaseFirstLetter(data?.['event_name'].split('_').pop()),
    },
    {
      label: 'Message',
      key: 'message',
      type: TableDataType.text,
    },
    {
      label: 'Initial',
      key: 'observer.profile.upi',
      type: TableDataType.text,
    },
    {
      label: 'Observer',
      key: 'observer.profile.full_name',
      type: TableDataType.text,
    },
  ];

  dataSource?: ListPaginate<ZaloMessageDto>;
  messageSelected: Set<number> = new Set<number>();

  private _queryParams: QueryZaloMessageDto = {
    filter: this.getQueryParam('filter'),
    page: this.getQueryParam<number>('page') || 1,
    limit: this.getQueryParam<number>('limit') || 10,
    sorting: this.getQueryParam('sorting'),
    activities: this.getQueryParam<number>('activities'),
    observe_by: this.getQueryParam('observe_by'),
    message_type: this.getQueryParam('message_type'),
    date_range: this.getAllQueryParam<Date>('date_range'),
  };

  protected readonly queryParams$: Subject<QueryZaloMessageDto> =
    new Subject<QueryZaloMessageDto>();

  constructor(
    injector: Injector,
    private readonly azureService: AzureStorageService,
    private readonly zaloMessageService: ZaloMessageService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.queryParams$
      .pipe(debounceTime(300))
      .subscribe(query => this._handleFilterChange(query));

    this.activeRoute.queryParams.subscribe(() => this.getDataSource());
  }

  get totalRecord(): number {
    return this.dataSource?.total_records as number;
  }

  getDataSource(): void {
    if (!isEmpty(this.messageSelected))
      this.messageSelected = new Set<number>();

    this.zaloMessageService.getByPaged(this._queryParams).subscribe({
      next: response => (this.dataSource = response),
    });
  }

  disabledMessageHasObserve(data: Dictionary): boolean {
    return data?.['observe_by'] ? true : false;
  }

  openObserveModal() {
    this.isVisibleObserve = true;
  }

  handleObserveMessage(comment: string): Observable<void> {
    const messageSelectedID = Array.from(this.messageSelected).map(
      index => this.dataSource?.data[index].id as number
    );

    return this.zaloMessageService
      .observeMessages({
        comment,
        message_ids: messageSelectedID,
      })
      .pipe(tap(() => this.getDataSource()));
  }

  export(): void {
    this.zaloMessageService.export(this._queryParams).subscribe({
      next: response =>
        this.azureService.downloadFile(response.key, 'Export_ZaloMessage'),
    });
  }

  private _handleFilterChange(query: QueryZaloMessageDto): void {
    const tmp: QueryZaloMessageDto = {
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
