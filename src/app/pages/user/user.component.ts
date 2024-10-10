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
import { SelectOption } from '@components/lazy-select/lazy-select.component';
import { RoleService } from '@services/role.service';
import { UserService } from '@services/user.service';
import { AppBaseComponent } from '@shared/app.base.component';
import { Dictionary, ListPaginate } from '@shared/types/base';
import { QueryUser, UserDto } from '@shared/types/user';
import { getNumber } from '@utils/common-helper';
import { debounceTime, map, Subject } from 'rxjs';

@Component({
  templateUrl: './user.component.html',
})
export class UserComponent extends AppBaseComponent implements OnInit {
  isVisible = false;

  filters: ActionBarFilter[] = [
    {
      name: 'filter',
      type: 'search',
      placeholder: 'Search',
      size: 6,
      value: this.getQueryParam('filter'),
    },
    {
      name: 'roles',
      type: 'multiple-select',
      placeholder: 'Role',
      size: 3,
      value: this.getAllQueryParam<string>('roles'),
      $options: this.roleService.getAll().pipe(
        map(data => {
          return data
            .filter(v => v.slug !== 'user_standard')
            .map(v => {
              return {
                label: v.name,
                value: v.slug,
              } as SelectOption;
            });
        })
      ),
    },
  ];

  actions: ActionBarCustomAction[] = [
    {
      label: 'Create',
      icon: 'plus',
      permission: 'user_manage_create',
      act: () => {
        this.redirect('create');
      },
    },
    {
      label: 'Import',
      icon: 'import',
      permission: 'user_manage_import',
      act: () => {
        this.isVisible = true;
      },
    },
  ];

  headers: TableHeader[] = [
    {
      label: 'Initial',
      key: 'profile.upi',
      type: TableDataType.text,
    },
    {
      label: 'Created Time',
      key: 'created_at',
      type: TableDataType.date_time,
      sortable: true,
    },
    {
      label: 'Username',
      key: 'username',
      type: TableDataType.text,
    },
    {
      label: 'Full name',
      key: 'profile.full_name',
      type: TableDataType.text,
    },
    {
      label: 'Phone Number',
      key: 'profile.phone',
      type: TableDataType.text,
      sortable: true,
    },
    {
      label: 'Email',
      key: 'email',
      type: TableDataType.text,
    },
    {
      label: 'Role',
      key: 'user_roles.role.name',
      type: TableDataType.nest_array,
    },
    {
      label: 'Status',
      key: 'status',
      type: TableDataType.switch,
      permission: 'user_manage_update',
      act: id => {
        this.userService.toggle(id.toString()).subscribe(() => {
          this.msgService.success('Update status successful!');
        });
      },
      disable: this.hasRoleAdmin.bind(this),
    },
  ];

  dataSource: ListPaginate<UserDto> | undefined = undefined;

  editAction: TableAction = {
    permission: 'user_manage_update',
    act: id => {
      this.redirect(`edit/${id}`);
    },
  };

  customAction: TableAction[] = [
    {
      icon: 'undo',
      permission: 'user_manage_update',
      confirm: 'Do you want to refesh password for this user?',
      act: (id: string | number) => {
        if (id) {
          this.refreshPassword(id.toString());
        }
      },
    },
  ];

  private _queryParams: QueryUser = {
    filter: this.getQueryParam('filter'),
    page: this.getQueryParam<number>('page') || 1,
    limit: this.getQueryParam<number>('limit') || 10,
    sorting: this.getQueryParam('sorting'),
    status: getNumber(this.getQueryParam('status')),
    roles: this.getAllQueryParam('roles'),
  };

  protected readonly queryParams$: Subject<QueryUser> =
    new Subject<QueryUser>();

  constructor(
    injector: Injector,
    private readonly userService: UserService,
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
    this.userService.getByPaged(this._queryParams).subscribe(data => {
      this.dataSource = data;
    });
  }

  refreshPassword(id: string): void {
    this.userService.getById(id).subscribe(data => {
      if (data?.email) {
        this.authService.forgot({ email: data?.email }).subscribe(() => {
          this.msgService.success('Refresh password successful!');
          this.getDataSource();
        });
      }
    });
  }

  hasRoleAdmin(data: Dictionary) {
    return (data as UserDto)?.user_roles[0]?.role?.slug === 'admin';
  }

  private _handleFilterChange(query: QueryUser): void {
    const tmp: QueryUser = {
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
