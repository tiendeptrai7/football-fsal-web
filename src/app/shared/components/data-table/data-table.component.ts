import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AppBaseComponent } from '@shared/app.base.component';
import { BaseQuery, Dictionary, ListPaginate } from '@shared/types/base';
import { formatDate } from '@utils/date';
import { get, head } from 'lodash';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { environment } from '@/environments/environment';

export enum TableDataType {
  switch = 1,
  text,
  img,
  date,
  date_time,
  nest_array,
  render,
  button,
  simple_edit,
}

export type TableHeader = {
  label: string;
  key: string;
  type: TableDataType;
  transform?: 'lower' | 'upper' | 'currency';
  act?: (id: string | number, data?: Dictionary) => void;
  width?: string;
  sticky?: 'left' | 'right';
  permission?: string;
  disable?: (data: Dictionary) => boolean;
  sortable?: boolean;
  render?: (data: Dictionary, index: number) => string;
  icon?: string;
  hide?: (data: Dictionary, index: number) => boolean;
};

export type TableAction = {
  disable?: (data: Dictionary) => boolean;
  permission?: string;
  icon?: string;
  confirm?: string;
  tooltip?: string;
  act: (id: string | number) => void;
};

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
})
export class DataTableComponent extends AppBaseComponent implements OnChanges {
  @Input() mainKey = 'id';

  @Input() headers!: TableHeader[];
  @Input() dataSource?: ListPaginate<Dictionary>;

  @Input() loading = false;
  @Input() showIndex = true;
  @Input() showSelection = false;
  @Input() sorting?: string;
  @Input() selectedIndex: Set<number> = new Set<number>();

  @Input() isAction = false;
  @Input() customAction?: TableAction[];
  @Input() editAction?: TableAction;
  @Input() deleteAction?: TableAction;

  @Input() actionDisableRule?: (data: Dictionary) => boolean;

  @Output() queryParamsChange: EventEmitter<BaseQuery> =
    new EventEmitter<BaseQuery>();

  @Output()
  selectedIndexChange: EventEmitter<Set<number>> = new EventEmitter<
    Set<number>
  >();

  protected readonly DataType = TableDataType;
  protected readonly formatDate = formatDate;

  isSelectedAll: boolean = false;
  indeterminate: boolean = false;

  editCache: {
    [key: string]: { edit: Dictionary; data: Dictionary };
  } = {};

  formatterNumber = (value: number): string =>
    new Intl.NumberFormat('en-US').format(value);

  get actionColumnSize(): string {
    const count =
      (this.editAction ? 1 : 0) +
      (this.deleteAction ? 1 : 0) +
      (this.customAction?.length || 0);

    return (count * 60 < 100 ? 150 : count * 60) + 'px';
  }

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedIndex']) this.refreshSelectedStatus();

    if (changes['dataSource']?.currentValue) {
      this.updateEditCache();
    }
  }

  getImage(url?: string): string {
    if (!url) return '';
    if (url.startsWith('http')) {
      return url;
    } else {
      return `${environment.media.publishUrl}${url}`;
    }
  }

  getSortDir(key: string): string | null {
    const tmp = this.sorting?.split(' ');
    if (tmp?.length) {
      const [sortKey, dir] = tmp;
      if (key === sortKey) {
        return dir ? dir + 'end' : null;
      }
    }

    return null;
  }

  extractData(
    input: Dictionary,
    key: string,
    transform?: 'lower' | 'upper' | 'currency'
  ): string | undefined {
    const data = get(input, key);
    if (transform === 'lower') {
      return data?.toLowerCase();
    }

    if (transform === 'upper') {
      return data?.toUpperCase();
    }

    if (transform === 'currency') {
      return new Intl.NumberFormat('vi-VN').format(+data) + 'VNĐ';
    }

    return data;
  }

  extractDataFromArray(
    input: Dictionary,
    key: string,
    transform?: 'lower' | 'upper' | 'currency'
  ) {
    const keys = key.split('.');
    let value = input;

    for (const k of keys) {
      if (Array.isArray(value)) {
        value = value.map(item => item[k]);
      } else {
        value = value[k];
      }
    }
    const data = Array.isArray(value) ? value.join(', ') : value;

    if (transform === 'lower') {
      return data?.toLowerCase();
    }

    if (transform === 'upper') {
      return data?.toUpperCase();
    }

    return data;
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;

    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    let sorting = undefined;
    if (sortField && sortOrder) {
      const sortType = (sortOrder as string)?.replace('end', '');
      sorting = `${sortField} ${sortType}`;
    }

    this.queryParamsChange.emit({
      page: pageIndex || 1,
      limit: pageSize || 10,
      sorting: sorting,
    });
  }

  isHTML(str: string | undefined) {
    if (!str) return false;
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    return doc.body.childNodes.length > 0;
  }

  saveEdit(
    id: number,
    key: string,
    act?: (id: string | number, data?: Dictionary) => void
  ): void {
    if (!this.dataSource?.data?.length) return;
    const index = this.dataSource?.data.findIndex(
      item => item[this.mainKey] === id
    );
    if (index < 0) return;

    Object.assign(this.dataSource.data[index], this.editCache[id].data);
    if (act) {
      act(id, this.dataSource.data[index]);
    }
    this.editCache[id].edit[key] = false;
  }

  updateEditCache(): void {
    this.dataSource?.data.forEach(item => {
      this.editCache[item[this.mainKey]] = {
        edit: {},
        data: { ...item },
      };
    });
  }

  startEdit(id: string, key: string): void {
    this.editCache[id].edit[key] = true;
  }

  cancelEdit(id: number, key: string): void {
    if (!this.dataSource?.data?.length) return;
    const index = this.dataSource.data.findIndex(
      item => item[this.mainKey] === id
    );
    this.editCache[id].data = this.dataSource.data[index];
    this.editCache[id].edit[key] = false;
  }

  // ------------------------------------------------------------------

  updateSelectedRecord(index: number, value: boolean): void {
    if (value) {
      this.selectedIndex.add(index);
      this.selectedIndexChange.emit(this.selectedIndex);
    } else {
      this.selectedIndex.delete(index);
      this.selectedIndexChange.emit(this.selectedIndex);
    }
  }

  refreshSelectedStatus(): void {
    this.isSelectedAll =
      this.dataSource?.data.every((_, index) =>
        this.selectedIndex.has(index)
      ) ?? false;
    this.indeterminate =
      (this.dataSource?.data.some((_, index) =>
        this.selectedIndex.has(index)
      ) ??
        false) &&
      !this.isSelectedAll;
  }

  onSelectedAll(value: boolean): void {
    const data = this.dataSource?.data;

    data?.forEach((item, index) => {
      const isDisabled = this.actionDisableRule
        ? this.actionDisableRule(item)
        : false;

      if (!isDisabled) this.updateSelectedRecord(index, value);
    });
    this.refreshSelectedStatus();
  }

  onItemSelected(index: number, value: boolean): void {
    this.updateSelectedRecord(index, value);
    this.refreshSelectedStatus();
  }

  protected readonly head = head;
  protected readonly parseFloat = parseFloat;
}
