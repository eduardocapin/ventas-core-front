import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption
} from 'echarts/components';

import { PieChart, PieSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | PieSeriesOption
>;

@Component({
  selector: 'app-grafica-clientes',
  templateUrl: './grafica-clientes.component.html',
  styleUrls: ['./grafica-clientes.component.scss']
})

export class GraficaClientesComponent {

  chart: echarts.ECharts | undefined;

  resize() {
    this.chart?.resize();
  }

  pintarGrafica() {

    var chartDom = document.getElementById('main')!;
    var myChart = echarts.init(chartDom);
    this.chart = myChart;
    var option: EChartsOption;

    option = {
      color: [
        '#87CEFA',
        '#dbdbdb',

      ],
      title: {
        top: 10,
        text: 'Clientes',
        left: 'center',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 15
        }
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {

        orient: 'horizontal',
        top: 40,
      },
      series: [
        {
          bottom: -50,
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1324, name: 'Con rechazos' },
            { value: 570, name: 'Sin rechazos' }

          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    (opts?: {
      width?: '80%',
      height?: '80%',
      silent?: false,
      animation?: {

      }
    }) => echarts;

    option && myChart.setOption(option);
  }
}
