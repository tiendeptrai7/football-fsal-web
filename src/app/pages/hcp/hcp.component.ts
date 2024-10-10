import { Component, Injector, OnInit } from '@angular/core';
import { debounceTime, map, Subject } from 'rxjs';

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
import { EHCPType, EStatus } from '@/app/shared/constant/enum';
import { AzureStorageService } from '@/app/shared/services/azure-storage.service';
import { EventService } from '@/app/shared/services/event.service';
import { HcpService } from '@/app/shared/services/hcp.service';
import { Dictionary, ListPaginate } from '@/app/shared/types/base';
import { HcpDto, QueryHcpDto } from '@/app/shared/types/hcp';
import { getNumber } from '@/app/shared/utils/common-helper';

@Component({
  selector: 'app-hcp',
  templateUrl: './hcp.component.html',
})
export class HcpComponent extends AppBaseComponent implements OnInit {
  filters: ActionBarFilter[] = [
    {
      name: 'filter',
      type: 'search',
      placeholder: 'Search (HCP ID, HCP Name, Phone Number, Zalo Phone Number)',
      size: 3,
      value: this.getQueryParam('filter'),
    },
    {
      name: 'event_id',
      type: 'select-async',
      placeholder: 'Event',
      size: 3,
      value: getNumber(this.getQueryParam('event_id')),
      $options: this.eventService
        .getListEventRelatedHCP()
        .pipe(
          map((events): SelectOption[] =>
            events.map(
              (event): SelectOption => ({ label: event.name, value: event.id })
            )
          )
        ),
    },
    {
      name: 'type',
      type: 'select',
      placeholder: 'HCP Type',
      size: 3,
      value: getNumber(this.getQueryParam('type')),
      options: [
        { label: 'NN', value: EHCPType.NN },
        { label: 'Referral', value: EHCPType.Referral },
      ],
    },
    {
      name: 'ref_id',
      type: 'select-async',
      placeholder: 'Refer by',
      size: 3,
      value: getNumber(this.getQueryParam('ref_id')),
      $options: this.hcpService
        .getListHcpHasRef()
        .pipe(
          map((hcps): SelectOption[] =>
            hcps.map(
              (hcp): SelectOption => ({ label: hcp.name, value: hcp.id })
            )
          )
        ),
    },
    {
      name: 'status',
      type: 'select',
      placeholder: 'Match phone',
      size: 3,
      value: getNumber(this.getQueryParam('status')),
      options: [
        { label: 'Yes', value: EStatus.active },
        { label: 'No', value: EStatus.inactive },
      ],
    },
  ];

  actions: ActionBarCustomAction[] = [
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
      label: 'Detail',
      key: '',
      type: TableDataType.button,
      icon: 'container',
      width: '100px',
      sticky: 'left',
      act: id => {
        this.redirect(`${id}`);
      },
      hide: () => false,
    },
    {
      label: 'HCP ID',
      key: 'code',
      type: TableDataType.text,
    },
    {
      label: 'HCP Type',
      key: 'type',
      type: TableDataType.render,
      render: data => `${EHCPType[data?.['type'] as keyof typeof EHCPType]}`,
    },
    {
      label: 'HCP Name',
      key: 'name',
      type: TableDataType.text,
    },
    {
      label: 'Prefix',
      key: 'prefix',
      type: TableDataType.text,
    },
    {
      label: 'Phone Number',
      key: 'phone',
      type: TableDataType.render,
      render: (data: Dictionary) => {
        const tmp = data as HcpDto;
        if (
          tmp?.phone !== tmp?.user?.profile?.phone &&
          tmp?.user?.profile?.phone
        ) {
          return `<span class="p-1 rounded badge" style="color: #ffc800;"> ${tmp.phone} </span>`;
        }
        return tmp?.phone ?? '';
      },
    },
    {
      label: 'Zalo Phone Number',
      key: 'user.profile.phone',
      type: TableDataType.render,
      render: (data: Dictionary) => {
        const tmp = data as HcpDto;
        if (
          tmp?.phone !== tmp?.user?.profile?.phone &&
          tmp?.user?.profile?.phone
        ) {
          return `<span class="p-1 rounded badge" style="color: #ffc800;"> ${tmp?.user?.profile?.phone} </span>`;
        }
        return tmp?.user?.profile?.phone ?? '';
      },
    },
    {
      label: 'HCO',
      key: 'hco.name',
      type: TableDataType.text,
    },
    {
      label: 'Specialty',
      key: 'specialty',
      type: TableDataType.text,
    },
    {
      label: 'Refer by',
      key: 'ref.name',
      type: TableDataType.text,
    },
  ];

  dataSource?: ListPaginate<HcpDto>;

  private _queryParams: QueryHcpDto = {
    filter: this.getQueryParam('filter'),
    page: this.getQueryParam<number>('page') || 1,
    limit: this.getQueryParam<number>('limit') || 10,
    sorting: this.getQueryParam('sorting'),
    event_id: this.getQueryParam<number>('event_id'),
    type: this.getQueryParam<number>('type'),
    ref_id: this.getQueryParam<number>('ref_id'),
    status: this.getQueryParam<number>('status'),
  };

  protected readonly queryParams$: Subject<QueryHcpDto> =
    new Subject<QueryHcpDto>();

  constructor(
    injector: Injector,
    private readonly azureService: AzureStorageService,
    private readonly hcpService: HcpService,
    private readonly eventService: EventService
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
    this.hcpService.getByPaged(this._queryParams).subscribe({
      next: data => (this.dataSource = data),
    });
  }

  export(): void {
    this.hcpService.export(this._queryParams).subscribe({
      next: response =>
        this.azureService.downloadFile(response.key, 'Export_HCP'),
    });
  }

  private _handleFilterChange(query: QueryHcpDto): void {
    const tmp: QueryHcpDto = {
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
