import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import dayjs from 'dayjs';

@Pipe({ name: 'formatDatePipe' })
export class FormatDatePipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}
  transform(value: string | Date | undefined, format = 'DD/MM/YY') {
    if (!value) return value;
    return dayjs(value).local().format(format);
  }
}
