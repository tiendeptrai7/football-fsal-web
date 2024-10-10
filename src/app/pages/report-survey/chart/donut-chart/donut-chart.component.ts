import { Component, Input } from '@angular/core';
import {
  ApexChart,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: 'donut-chart',
  templateUrl: './donut-chart.component.html',
})
export class DonutChartComponent {
  public chartOptions: ChartOptions;

  @Input() data: number[] = [];
  @Input() label: string[] = [];
  @Input() progress: string = '';

  constructor() {
    this.chartOptions = {
      series: this.data,
      chart: {
        type: 'donut',
        width: '350',
        height: '350',
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Progress',
                formatter: () => this.progress,
              },
            },
          },
        },
      },
      labels: this.label,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
              markers: {
                radius: 10,
              },
            },
          },
        },
      ],
      legend: {
        position: 'bottom',
        offsetY: -50,
        markers: {
          radius: 10,
        },
      },
    };
  }

  updateChart(data: number[], label: string[], progress: string): void {
    this.chartOptions.series = data;
    this.chartOptions.labels = label;
    if (
      this.chartOptions.plotOptions &&
      this.chartOptions.plotOptions.pie &&
      this.chartOptions.plotOptions.pie.donut &&
      this.chartOptions.plotOptions.pie.donut.labels &&
      this.chartOptions.plotOptions.pie.donut.labels.total
    ) {
      this.chartOptions.plotOptions.pie.donut.labels.total.formatter = () =>
        progress;
    }
  }
}
