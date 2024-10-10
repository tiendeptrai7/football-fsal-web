import { Component, Injector, OnInit } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

import { AppBaseComponent } from '@/app/shared/app.base.component';
import { ActionBarFilter } from '@/app/shared/components/action-bar/action-bar.component';
import {
  TableDataType,
  TableHeader,
} from '@/app/shared/components/data-table/data-table.component';
import { EStatus } from '@/app/shared/constant/enum';
import { MedRepService } from '@/app/shared/services/med-rep.service';
import { ListPaginate } from '@/app/shared/types/base';
import { MedRepDto, QueryMedRepDto } from '@/app/shared/types/med-rep';
import { getNumber } from '@/app/shared/utils/common-helper';

@Component({
  selector: 'app-med-rep',
  templateUrl: './med-rep.component.html',
})
export class MedRepComponent extends AppBaseComponent implements OnInit {
  filters: ActionBarFilter[] = [
    {
      name: 'filter',
      type: 'search',
      placeholder: 'Search (MR ID, MR Name)',
      size: 4,
      value: this.getQueryParam('filter'),
    },
    {
      name: 'match_phone',
      type: 'select',
      placeholder: 'Match Phone',
      size: 3,
      options: [
        { label: 'Yes', value: EStatus.active },
        { label: 'No', value: EStatus.inactive },
      ],
      value: getNumber(this.getQueryParam('match_phone')),
    },
  ];

  headers: TableHeader[] = [
    {
      label: 'MR ID',
      key: 'code',
      type: TableDataType.text,
    },
    {
      label: 'MR Name',
      key: 'name',
      type: TableDataType.text,
    },
    {
      label: 'Phone Number',
      key: 'phone',
      type: TableDataType.text,
    },
    {
      label: 'Zalo Phone Number',
      key: 'user.profile.phone',
      type: TableDataType.text,
    },
    {
      label: 'Email',
      key: 'email',
      type: TableDataType.text,
    },
    {
      label: 'Business Unit',
      key: 'business_unit',
      type: TableDataType.text,
    },
    {
      label: 'Team',
      key: 'team',
      type: TableDataType.text,
    },
  ];

  dataSource?: ListPaginate<MedRepDto>;

  private _queryParams: QueryMedRepDto = {
    filter: this.getQueryParam('filter'),
    page: this.getQueryParam<number>('page') || 1,
    limit: this.getQueryParam<number>('limit') || 10,
    sorting: this.getQueryParam('sorting'),
    match_phone: getNumber(this.getQueryParam('match_phone')),
  };

  protected readonly queryParams$: Subject<QueryMedRepDto> =
    new Subject<QueryMedRepDto>();

  constructor(
    injector: Injector,
    private readonly medRepService: MedRepService
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
    this.medRepService.getByPaged(this._queryParams).subscribe({
      next: data => (this.dataSource = data),
    });
  }

  private _handleFilterChange(query: QueryMedRepDto): void {
    const tmp: QueryMedRepDto = {
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
