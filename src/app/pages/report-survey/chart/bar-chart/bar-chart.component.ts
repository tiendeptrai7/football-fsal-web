import { Component, Injector, Input, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

import { AppBaseComponent } from '@/app/shared/app.base.component';
import { ReportSurveyService } from '@/app/shared/services/survey-report.service';
import { BarChartDto } from '@/app/shared/types/survey-report';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
})
export class BarChartComponent extends AppBaseComponent implements OnInit {
  public chartOptions: ChartOptions;
  @Input()
  question_id!: number;
  @Input()
  survey_id!: number;
  @Input() data: number[] = [];
  @Input() label: string[] = [];

  dataSource: BarChartDto = {
    categories: [],
    data: [],
  };

  constructor(
    injector: Injector,
    private readonly reportSurveyService: ReportSurveyService
  ) {
    super(injector);
    this.chartOptions = {
      series: [
        {
          data: this.data,
        },
      ],
      chart: {
        type: 'bar',
        height: 300,
        width: '800px',
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: 'end',
          horizontal: true,
          barHeight: '50%',
          columnWidth: '50%',
          colors: {
            ranges: [
              {
                from: 0,
                to: 5,
                color: '#001965',
              },
            ],
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: this.label,
        max: 1,
      },
      yaxis: {
        min: 0,
        max: 1,
      },
    };
  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(() => {
      this.getDataSource();
    });
  }

  getDataSource(): void {
    if (this.survey_id && this.question_id) {
      this.reportSurveyService
        .getBarChart(this.survey_id, {
          question_id: this.question_id,
        })
        .subscribe(data => {
          this.dataSource = data;
          this.updateChartOptions();
        });
    }
  }

  updateChartOptions(): void {
    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          data: this.dataSource.data.map(x => parseInt(x)),
        },
      ],
      xaxis: {
        ...this.chartOptions.xaxis,
        categories: this.dataSource.categories,
      },
    };
  }
}
