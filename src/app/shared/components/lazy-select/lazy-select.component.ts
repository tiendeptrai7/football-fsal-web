import {
  Component,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseQuery } from '@shared/types/base';
import _ from 'lodash';
import { debounceTime, Observable, Subject, Subscription } from 'rxjs';

export type SelectOption = {
  label: string;
  value: string | number;
  [key: string]: string | number;
};

export type LazySelectDataSource = (
  params: BaseQuery
) => Observable<SelectOption[]>;

@Component({
  selector: 'lazy-select',
  templateUrl: './lazy-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LazySelectComponent),
      multi: true,
    },
  ],
})
export class LazySelectComponent
  implements ControlValueAccessor, OnInit, OnChanges, OnDestroy
{
  @Input() dataSource!: LazySelectDataSource;
  @Input() placeholder!: string;
  @Input() defaultSelected?: SelectOption;
  @Input() mode: 'default' | 'multiple' = 'default';

  searchTerm: Subject<string> = new Subject<string>();
  subscription: Subscription | undefined;

  private _selectedItem: string | number | string[] | number[] | undefined;
  get value(): string | number | string[] | number[] | undefined {
    return this._selectedItem;
  }

  set value(value: string | number | string[] | number[]) {
    if (this._selectedItem !== value) {
      this._selectedItem = value;
      this.onChange.forEach(f => f(value));
    }
  }

  optionList: SelectOption[] = [];
  page = 1;
  limit = 10;

  isLoading = false;
  isOver = false;

  isDisabled = false;

  private onChange = new Array<
    (value: string | number | string[] | number[]) => void
  >();
  private onTouch = new Array<() => void>();

  ngOnInit(): void {
    this.subscription = this.searchTerm
      .pipe(debounceTime(400))
      .subscribe((searchValue: string) => {
        this.loadDataSource(searchValue);
      });
    this.searchTerm.next('');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultSelected']?.currentValue) {
      this.optionList = [
        changes['defaultSelected'].currentValue,
        ...this.optionList,
      ];
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  loadMore(): void {
    if (this.isOver) return;
    this.page += 1;
    this.searchTerm.next('');
  }

  loadDataSource(filter = ''): void {
    if (!this.dataSource) return;
    this.isLoading = true;
    this.dataSource({ limit: this.limit, page: this.page, filter }).subscribe(
      data => {
        if (!data.length) {
          this.isOver = true;
        } else {
          this.optionList = [...this.optionList, ...data];
        }
        this.optionList = _.uniqBy(this.optionList, 'value');
        this.isLoading = false;
      }
    );
  }

  writeValue(value: string | number | string[] | number[]): void {
    this._selectedItem = value;
  }

  registerOnChange(fn: never): void {
    this.onChange.push(fn);
  }

  registerOnTouched(fn: never): void {
    this.onTouch.push(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onSearch(value: string) {
    this.searchTerm.next(value);
  }
}
