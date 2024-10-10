import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { LazySelectDataSource } from '@components/lazy-select/lazy-select.component';
import { PermissionService } from '@services/permission.service';
import { Observable, Subject, throttleTime } from 'rxjs';

export type ActionBarFilter = {
  name: string | string[];
  size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 12;
  type:
    | 'select'
    | 'search'
    | 'date'
    | 'week'
    | 'month'
    | 'date-range'
    | 'lazy-select'
    | 'lazy-multiple-select'
    | 'month-range'
    | 'multiple-select'
    | 'select-async'
    | 'input-hidden';
  placeholder?: string;
  value?: Date | Date[] | string | string[] | number | number[];
  format?: string;
  options?: { label: string; value: string | number }[];
  $options?: Observable<{ label: string; value: string | number }[]>;
  lazyDataSource?: LazySelectDataSource;
};

export type ActionBarCustomAction = {
  label: string;
  icon: string;
  act: string | (() => void);
  permission?: string;
};

type QueryParams = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any | any[];
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'action-bar',
  templateUrl: './action-bar.component.html',
  styles: [':host{ margin-bottom: 2rem; display: block; }'],
})
export class ActionBarComponent<T> implements OnInit {
  @Input() filters: ActionBarFilter[] = [];

  @Input() actions: ActionBarCustomAction[] = [];

  @Input() triggerApply: 'click' | 'all' = 'click';

  @Input() throttleTime = 200;

  @Input() hideBtnReset = false;

  @Input() hideBtnApply = false;

  @Output() queryParamsChange: EventEmitter<T> = new EventEmitter<T>();

  private filter$: Subject<void> = new Subject<void>();

  isLoadingAct = false;

  @HostListener('window:keyup.enter', ['$event'])
  handleKeyUpEnter(event: Event) {
    if (this.triggerApply === 'click') return;
    event.preventDefault();
    event.stopPropagation();
    this.applyFilter();
  }

  constructor(
    private readonly router: Router,
    private readonly permissionService: PermissionService,
    private readonly cd: ChangeDetectorRef
  ) {}

  applyFilter(): void {
    this.filter$.next();
  }

  handleFilter(): void {
    const query: QueryParams = {};
    this.filters.forEach(filter => {
      const nameArray = Array.isArray(filter.name)
        ? filter.name
        : [filter.name];

      const value:
        | Date
        | string
        | Date[]
        | string[]
        | number
        | number[]
        | undefined = filter.value;

      nameArray.forEach(name => {
        switch (filter.type) {
          case 'date-range':
          case 'month-range':
            query[name as string] = (value as string[])?.map(v =>
              new Date(v).toISOString()
            );
            break;
          case 'date':
          case 'month':
            query[name as string] = value
              ? new Date(value as string).toISOString()
              : undefined;
            break;
          default:
            query[name as string] = value;
            break;
        }
      });
    });

    query['page'] = 1;

    this.queryParamsChange.emit(query as T);
  }

  sleep(ms: number) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  async actionClick(act: string | (() => void)) {
    if (typeof act === 'string') {
      this.router.navigate([act]).then();
    } else {
      try {
        if (this.isLoadingAct) return;
        this.isLoadingAct = true;
        await act();
      } finally {
        this.isLoadingAct = false;
        this.cd.detectChanges();
      }
    }
  }

  hasPermission(permission?: string): boolean {
    if (permission) {
      return this.permissionService.currentPermissions?.includes(permission);
    }
    return true;
  }

  resetFilter(): void {
    this.router
      .navigate([], {
        queryParams: {},
        queryParamsHandling: '',
      })
      .then();
    this.filters.map(filter => (filter.value = undefined));
    this.applyFilter();
  }

  ngOnInit(): void {
    this.filter$.pipe(throttleTime(this.throttleTime)).subscribe(() => {
      this.handleFilter();
    });
  }
}
