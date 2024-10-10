import { Component, Injector, Input, OnInit } from '@angular/core';

import { AppBaseComponent } from '@/app/shared/app.base.component';
import { ReportSurveyService } from '@/app/shared/services/survey-report.service';
import { ShortAnswerDto } from '@/app/shared/types/survey-report';

@Component({
  selector: 'short-answer',
  templateUrl: './short-answer.component.html',
})
export class ShortAnswerComponent extends AppBaseComponent implements OnInit {
  @Input()
  question_id!: number;
  @Input()
  survey_id!: number;
  dataSource: ShortAnswerDto[] = [];
  dataSourceLimit: ShortAnswerDto[] = [];

  constructor(
    injector: Injector,
    private readonly reportSurveyService: ReportSurveyService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(() => {
      this.getDataSource();
    });
  }

  getDataSource(): void {
    if (this.survey_id && this.question_id) {
      this.reportSurveyService
        .getShortAnswer(this.survey_id, {
          question_id: this.question_id,
        })
        .subscribe(data => {
          this.dataSource = data;
          this.dataSourceLimit = this.dataSource.slice(0, 3);
        });
    }
  }

  showMore(): void {
    this.dataSourceLimit = this.dataSource;
  }
}
