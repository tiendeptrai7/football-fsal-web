import { Component, Injector, OnInit } from '@angular/core';
import {
  ActionBarCustomAction,
  ActionBarFilter,
} from '@components/action-bar/action-bar.component';
import {
  TableAction,
  TableDataType,
  TableHeader,
} from '@components/data-table/data-table.component';
import { RoleService } from '@services/role.service';
import { AppBaseComponent } from '@shared/app.base.component';
import { Dictionary, ListPaginate } from '@shared/types/base';
import { QueryRole, RoleDto } from '@shared/types/role';
import { debounceTime, Subject } from 'rxjs';

@Component({
  templateUrl: './role.component.html',
})
export class RoleComponent extends AppBaseComponent implements OnInit {
  filters: ActionBarFilter[] = [
    {
      name: 'filter',
      type: 'search',
      placeholder: 'Search',
      size: 6,
      value: this.getQueryParam('filter'),
    },
  ];

  actions: ActionBarCustomAction[] = [
    {
      label: 'Create',
      icon: 'plus',
      permission: 'role_manage_create',
      act: () => {
        this.redirect('create');
      },
    },
  ];

  headers: TableHeader[] = [
    {
      label: 'Created Time',
      key: 'created_at',
      type: TableDataType.date,
      sortable: true,
    },
    {
      label: 'Role Code',
      key: 'slug',
      type: TableDataType.text,
      sortable: true,
    },
    {
      label: 'Role Name',
      key: 'name',
      type: TableDataType.text,
      sortable: true,
    },
    {
      label: 'Status',
      key: 'status',
      type: TableDataType.switch,
      act: id => {
        this.roleService.toggle(+id).subscribe(() => {
          this.msgService.success('Update status successful!');
        });
      },
      disable: () => !this.hasPermission('role_manage_update'),
    },
  ];

  dataSource: ListPaginate<RoleDto> | undefined = undefined;

  editAction: TableAction = {
    act: this.editRole.bind(this),
    disable: () => {
      return !this.hasPermission('role_manage_update');
    },
  };

  private _queryParams: QueryRole = {
    filter: this.getQueryParam('filter'),
    page: this.getQueryParam<number>('page') || 1,
    limit: this.getQueryParam<number>('limit') || 10,
    sorting: this.getQueryParam('sorting'),
  };

  protected readonly queryParams$: Subject<QueryRole> =
    new Subject<QueryRole>();

  constructor(
    injector: Injector,
    private readonly roleService: RoleService
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
    this.roleService.getByPaged(this._queryParams).subscribe(data => {
      this.dataSource = data;
    });
  }

  editRole(id: string | number): void {
    this.redirect(`edit/${id}`);
  }

  isDefaultRole(role: Dictionary): boolean {
    return ['admin', 'user_standard'].includes(role['slug']);
  }

  private _handleFilterChange(query: QueryRole): void {
    const tmp: QueryRole = {
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
