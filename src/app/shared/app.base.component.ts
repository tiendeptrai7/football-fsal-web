import { Injector } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import {
  ActivatedRoute,
  NavigationExtras,
  Params,
  Router,
} from '@angular/router';
import { PermissionService } from '@services/permission.service';
import { Dictionary } from '@shared/types/base';
import dayjs from 'dayjs';
import { DisabledTimeConfig } from 'ng-zorro-antd/date-picker';
import { NzMessageService } from 'ng-zorro-antd/message';

import { environment } from '@/environments/environment';

import { AuthService } from './services/auth.service';

export abstract class AppBaseComponent {
  protected readonly router: Router;
  protected readonly activeRoute: ActivatedRoute;
  protected readonly authService: AuthService;
  protected readonly msgService: NzMessageService;
  protected readonly permissionService: PermissionService;

  nzErrorRequire = 'This field is required.';
  nzInvalidType = 'Invalid data type.';

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  protected constructor(readonly injector: Injector) {
    this.router = injector.get(Router);
    this.activeRoute = injector.get(ActivatedRoute);
    this.authService = injector.get(AuthService);
    this.permissionService = injector.get(PermissionService);
    this.msgService = injector.get(NzMessageService);
  }

  protected redirect(url: string, params: Params = {}, isRelative = true) {
    const navigationExtras: NavigationExtras = {
      queryParams: params,
      relativeTo: isRelative ? this.activeRoute : null,
    };

    this.router.navigate([url], navigationExtras).then();
  }

  protected redirectOpenNewTab(
    url: string,
    params: Params = {},
    isRelative = true
  ) {
    const urlTree = this.router.createUrlTree([url], {
      relativeTo: isRelative ? this.activeRoute : null,
      queryParams: params,
    });
    const fullUrl = this.router.serializeUrl(urlTree);
    window.open(fullUrl, '_blank');
  }

  protected setQueryParam(params: Dictionary): void {
    this.router
      .navigate([], {
        relativeTo: this.activeRoute,
        queryParams: { ...params },
        queryParamsHandling: 'merge',
      })
      .then();
  }

  protected getRouteParam<T>(param: string): T {
    return this.activeRoute.snapshot.paramMap.get(param) as T;
  }

  protected getQueryParam<T>(param: string): T {
    return this.activeRoute.snapshot.queryParamMap.get(param) as T;
  }

  protected getAllQueryParam<T>(param: string): T[] {
    return this.activeRoute.snapshot.queryParamMap.getAll(param) as T[];
  }

  protected compareObject(a: Dictionary, b: Dictionary): boolean {
    const keysToCompare = Object.keys({ ...a, ...b }).filter(
      key =>
        ![null, undefined].includes(a[key]) ||
        ![null, undefined].includes(b[key])
    );

    return keysToCompare.every(key => a[key] == b[key]);
  }

  protected isFieldError(field: FormControl): boolean {
    return field.invalid && (field.dirty || field.touched);
  }

  protected formControlCompareWith(
    otherControlName: string,
    isEqual?: boolean
  ) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.parent) {
        return null;
      }
      const thisValue = control.value;
      const otherControl = control.parent.get(otherControlName);
      const otherValue = otherControl?.value;

      const isMismatch = isEqual
        ? thisValue === otherValue
        : thisValue !== otherValue;

      if (isMismatch) {
        return { confirm: true, error: true };
      }

      return null;
    };
  }

  protected validateFormGroup(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control: AbstractControl) => {
      if (control.invalid) {
        if (control instanceof FormGroup) {
          this.validateFormGroup(control);
        } else if (control instanceof FormArray) {
          this.validateFormArray(control);
        } else {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      }
    });
  }

  protected validateFormArray(formArray: FormArray) {
    formArray.controls.forEach((control: AbstractControl) => {
      if (control instanceof FormGroup) {
        this.validateFormGroup(control);
      } else if (control instanceof FormArray) {
        this.validateFormArray(control);
      }
    });
  }

  protected hasPermission(permission?: string): boolean {
    if (permission) {
      return this.permissionService.currentPermissions?.includes(permission);
    }
    return true;
  }

  protected disabledDateLessThanCurrent = (value: Date) => {
    return dayjs().diff(value, 'days') > 0;
  };

  protected disabledDateTimeLessThan = (
    compareTime: Date = new Date()
    // annoyingTime?: { start: number; end: number }
  ) => {
    const compareDayjs = dayjs(compareTime);

    return {
      nzDisabledDate: (date: Date): boolean =>
        dayjs(date).isBefore(compareDayjs, 'day'),
      nzDisabledTime: (
        current: Date | Date[]
      ): DisabledTimeConfig | undefined => {
        if (!current || Array.isArray(current)) {
          return undefined;
        }

        const currentDayjs = dayjs(current);

        if (currentDayjs.isSame(compareDayjs, 'day')) {
          return {
            nzDisabledHours: () =>
              Array.from({ length: 24 }, (_, i) => i).filter(
                hour => hour < compareDayjs.hour()
              ),
            nzDisabledMinutes: (selectedHour: number) =>
              selectedHour === compareDayjs.hour()
                ? Array.from({ length: 60 }, (_, i) => i).filter(
                    min => min < compareDayjs.minute()
                  )
                : [],
            nzDisabledSeconds: (
              selectedHour: number,
              selectedMinute: number
            ) =>
              selectedHour === compareDayjs.hour() &&
              selectedMinute === compareDayjs.minute()
                ? Array.from({ length: 60 }, (_, i) => i).filter(
                    sec => sec < compareDayjs.second()
                  )
                : [],
          };
        }
        return undefined;
      },
    };
  };

  protected disabledDateTimeMoreThan = (
    compareTime: Date = new Date()
    // annoyingTime?: { start: number; end: number }
  ) => {
    const compareDayjs = dayjs(compareTime);

    return {
      nzDisabledDate: (date: Date): boolean =>
        dayjs(date).isAfter(compareDayjs, 'day'),
      nzDisabledTime: (
        current: Date | Date[]
      ): DisabledTimeConfig | undefined => {
        if (!current || Array.isArray(current)) {
          return undefined;
        }

        const currentDayjs = dayjs(current);

        if (currentDayjs.isSame(compareDayjs, 'day')) {
          return {
            nzDisabledHours: () =>
              Array.from({ length: 24 }, (_, i) => i).filter(
                hour => hour > compareDayjs.hour()
              ),
            nzDisabledMinutes: (selectedHour: number) =>
              selectedHour === compareDayjs.hour()
                ? Array.from({ length: 60 }, (_, i) => i).filter(
                    min => min > compareDayjs.minute()
                  )
                : [],
            nzDisabledSeconds: (
              selectedHour: number,
              selectedMinute: number
            ) =>
              selectedHour === compareDayjs.hour() &&
              selectedMinute === compareDayjs.minute()
                ? Array.from({ length: 60 }, (_, i) => i).filter(
                    sec => sec > compareDayjs.second()
                  )
                : [],
          };
        }
        return undefined;
      },
    };
  };

  protected getFileUrl(key: string): string {
    if (key.startsWith('http')) {
      return key;
    }

    return `${environment.media.publishUrl}/${key}`;
  }

  protected getFormControlError(control: AbstractControl | null): string {
    const errorMessages = {
      required: 'This field is required',
      minlength: 'Minimum length is ',
      maxlength: 'Maximum length is ',
      email: 'Please enter a valid email address',
      pattern: 'Please match the required pattern',
    };

    if (control && control.errors) {
      for (const [key, message] of Object.entries(errorMessages)) {
        if (control.errors[key]) {
          if (key === 'minlength' || key === 'maxlength') {
            return `${message}${control.errors[key].requiredLength}`;
          }
          return message;
        }
      }
    }
    return '';
  }
}
