import { Component, Injector, Input, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
} from 'ng-apexcharts';

import { AppBaseComponent } from '@/app/shared/app.base.component';
import { ReportSurveyService } from '@/app/shared/services/survey-report.service';
import { LineChartDto } from '@/app/shared/types/survey-report';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
  colors: string[];
};

@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
})
export class LineChartComponent extends AppBaseComponent implements OnInit {
  public chartOptions!: ChartOptions;
  @Input()
  question_id!: number;
  @Input()
  survey_id!: number;
  @Input() seriesData: { name: string; data: number[]; color?: string }[] = [];
  @Input() categories: string[] = [];

  dataSource: LineChartDto = {
    categories: [],
    data: [],
  };

  constructor(
    injector: Injector,
    private readonly reportSurveyService: ReportSurveyService
  ) {
    super(injector);
    this.chartOptions = {
      series: this.seriesData,
      chart: {
        type: 'line',
        height: 350,
        width: '800px',
      },
      colors: ['#001965'],
      stroke: {
        curve: 'smooth',
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: this.categories,
      },
      title: {
        text: '',
        align: 'left',
      },
    };
  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(() => {
      this.getDataSource();
    });
  }

  updateChartOptions(): void {
    this.chartOptions = {
      ...this.chartOptions,
      series: this.seriesData,
      xaxis: {
        ...this.chartOptions.xaxis,
        // categories: this.categories,
      },
    };
  }

  getDataSource(): void {
    if (this.survey_id && this.question_id) {
      this.reportSurveyService
        .getLineChart(this.survey_id, {
          question_id: this.question_id,
        })
        .subscribe(data => {
          this.dataSource = data;
          this.seriesData = [
            {
              name: 'Percentage',
              data: this.dataSource.data.map(x => parseInt(x)),
              color: '#001965',
            },
          ];
          // this.categories = this.dataSource.categories;
          this.updateChartOptions();
        });
    }
  }
}
