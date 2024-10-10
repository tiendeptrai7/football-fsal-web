import { Component, Injector, OnInit } from '@angular/core';
import { ActionBarFilter } from '@components/action-bar/action-bar.component';
import {
  TableAction,
  TableDataType,
  TableHeader,
} from '@components/data-table/data-table.component';
import { SystemService } from '@services/system.service';
import { AppBaseComponent } from '@shared/app.base.component';
import { ESystemType } from '@shared/constant/enum';
import { ListPaginate } from '@shared/types/base';
import { QuerySystem, SystemDto } from '@shared/types/setting';
import { debounceTime, Subject } from 'rxjs';

@Component({
  templateUrl: './system.component.html',
})
export class SystemComponent extends AppBaseComponent implements OnInit {
  get group(): string {
    return this.getRouteParam('group');
  }

  filters: ActionBarFilter[] = [
    {
      name: 'filter',
      type: 'search',
      placeholder: 'Search',
      size: 6,
      value: this.getQueryParam('filter'),
    },
  ];

  headers: TableHeader[] = [
    {
      label: 'Key',
      key: 'key',
      type: TableDataType.text,
      sortable: true,
    },
    {
      label: 'Name',
      key: 'name',
      type: TableDataType.text,
      sortable: true,
    },
    {
      label: 'Value',
      key: 'value',
      type: TableDataType.text,
      sortable: true,
    },
  ];

  dataSource: ListPaginate<SystemDto> | undefined = undefined;

  editAction: TableAction = {
    permission: 'system_manage_update',
    act: this.editSetting.bind(this),
  };

  private _queryParams: QuerySystem = {
    filter: this.getQueryParam('filter'),
    page: this.getQueryParam<number>('page') || 1,
    limit: this.getQueryParam<number>('limit') || 10,
    sorting: this.getQueryParam('sorting'),
    group: this.group,
  };

  protected readonly queryParams$: Subject<QuerySystem> =
    new Subject<QuerySystem>();

  constructor(
    injector: Injector,
    private readonly systemService: SystemService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.queryParams$.pipe(debounceTime(300)).subscribe(query => {
      this._handleFilterChange(query);
    });

    this.activeRoute.paramMap.subscribe(() => {
      this._queryParams = {
        filter: undefined,
        page: 1,
        limit: 10,
        sorting: undefined,
        group: this.group,
      };
      this.getDataSource();
    });

    this.activeRoute.queryParams.subscribe(() => {
      this.getDataSource();
    });
  }

  getDataSource(): void {
    this.systemService.getByPaged(this._queryParams).subscribe(data => {
      this.dataSource = {
        ...data,
        data: data.data?.map(d => ({
          ...d,
          value:
            d.unit === ESystemType.password
              ? '**********'
              : d.unit === ESystemType.json
                ? ''
                : d.value,
        })),
      };
    });
  }

  editSetting(id: string | number): void {
    this.redirect(`edit/${id}`);
  }

  private _handleFilterChange(query: QuerySystem): void {
    const tmp: QuerySystem = {
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
