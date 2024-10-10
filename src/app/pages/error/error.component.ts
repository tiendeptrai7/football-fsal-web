import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzExceptionStatusType } from 'ng-zorro-antd/result/result.component';

@Component({
  templateUrl: './error.component.html',
})
export class ErrorComponent implements OnInit {
  errorCode = '404';
  errorStatus: NzExceptionStatusType = '404';
  errorSubtitle = 'Sorry, the page you visited does not exist.';
  constructor(private activeRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.errorCode = this.activeRoute?.snapshot?.paramMap?.get('code') ?? '404';
    switch (this.errorCode) {
      case '401':
      case '403':
        this.errorStatus = '403';
        this.errorSubtitle =
          'Sorry, you are not authorized to access this page.';
        break;
      case '500':
        this.errorStatus = '500';
        this.errorSubtitle = 'Sorry, there is an error on server';
        break;
      case '404':
        this.errorStatus = '404';
        break;
      default:
        this.errorStatus = '404';
        this.errorCode = '404';
    }
  }
}
