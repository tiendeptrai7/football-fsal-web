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
import { FutsalTeamService } from '@/app/shared/services/futsal-team.service';
import { ListPaginate } from '@/app/shared/types/base';
import {
  FutsalTeamDto,
  QueryFutsalTeam,
} from '@/app/shared/types/football-team';

@Component({
  selector: 'app-football-team',
  templateUrl: './football-team.component.html',
})
export class FootballTeamComponent extends AppBaseComponent implements OnInit {
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
      label: 'Team Name',
      key: 'name',
      type: TableDataType.text,
    },
    {
      label: 'Team Code',
      key: 'code',
      type: TableDataType.text,
    },
    {
      label: 'Established Year',
      key: 'established_year',
      type: TableDataType.text,
    },
    {
      label: 'Status',
      key: 'status',
      type: TableDataType.switch,
      act: id => {
        this.futsalTeamService.toggle(+id).subscribe(() => {
          this.msgService.success('Update status successful!');
        });
      },
      disable: () => {
        return !this.hasPermission('');
      },
    },
  ];

  editAction: TableAction = {
    act: id => {
      this.redirect(`edit/${id}`);
    },
    disable: () => !this.hasPermission(''),
  };

  dataSource?: ListPaginate<FutsalTeamDto>;

  private _queryParams: QueryFutsalTeam = {
    filter: this.getQueryParam('filter'),
    page: this.getQueryParam<number>('page') || 1,
    limit: this.getQueryParam<number>('limit') || 10,
    sorting: this.getQueryParam('sorting'),
    status: this.getQueryParam<number>('status'),
    date_range: this.getAllQueryParam('date_range'),
  };

  protected readonly queryParams$: Subject<QueryFutsalTeam> =
    new Subject<QueryFutsalTeam>();

  constructor(
    injector: Injector,
    private readonly futsalTeamService: FutsalTeamService
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

    this.futsalTeamService
      .getByPaged(query)
      .subscribe(data => (this.dataSource = data));
  }

  private _handleFilterChange(query: QueryFutsalTeam): void {
    const tmp: QueryFutsalTeam = {
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
