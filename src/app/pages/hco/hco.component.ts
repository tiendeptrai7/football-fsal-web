import { Component, Injector, OnInit } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

import { AppBaseComponent } from '@/app/shared/app.base.component';
import { ActionBarFilter } from '@/app/shared/components/action-bar/action-bar.component';
import {
  TableDataType,
  TableHeader,
} from '@/app/shared/components/data-table/data-table.component';
import { HcoService } from '@/app/shared/services/hco.service';
import { BaseQuery, ListPaginate } from '@/app/shared/types/base';
import { HcoDto } from '@/app/shared/types/hco';

@Component({
  selector: 'app-hco',
  templateUrl: './hco.component.html',
})
export class HcoComponent extends AppBaseComponent implements OnInit {
  filters: ActionBarFilter[] = [
    {
      name: 'filter',
      type: 'search',
      placeholder: 'Search (HCO ID, HCO Name)',
      size: 6,
      value: this.getQueryParam('filter'),
    },
  ];

  headers: TableHeader[] = [
    {
      label: 'HCO ID',
      key: 'code',
      type: TableDataType.text,
    },
    {
      label: 'HCO Name',
      key: 'name',
      type: TableDataType.text,
    },
    {
      label: 'Status',
      key: 'status',
      type: TableDataType.render,
      render: data =>
        `<span class="p-1 rounded badge ${data?.['status'] ? 'bg-success' : 'bg-error'}">${data?.['status'] ? 'Active' : 'Deactive'}</span>`,
    },
  ];

  dataSource?: ListPaginate<HcoDto>;

  private _queryParams: BaseQuery = {
    filter: this.getQueryParam('filter'),
    page: this.getQueryParam<number>('page') || 1,
    limit: this.getQueryParam<number>('limit') || 10,
  };

  protected readonly queryParams$: Subject<BaseQuery> =
    new Subject<BaseQuery>();

  constructor(
    injector: Injector,
    private readonly hcoService: HcoService
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

    this.hcoService
      .getByPaged(query)
      .subscribe(data => (this.dataSource = data));
  }

  private _handleFilterChange(query: BaseQuery): void {
    const tmp: BaseQuery = {
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
