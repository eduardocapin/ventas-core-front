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
  selector: 'app-grafica-motivos',
  templateUrl: './grafica-motivos.component.html',
  styleUrls: ['./grafica-motivos.component.scss']
})
export class GraficaMotivosComponent {

  chart: echarts.ECharts | undefined;

  resize(){
    this.chart?.resize();
  }
  
  pintarGrafica() {
    var chartDom = document.getElementById('main2')!;
    var myChart = echarts.init(chartDom);
    this.chart = myChart;
    var option: EChartsOption;

    option = {
      /*
      AZULUES
      color: [
        '#87CEFA', // Light Sky Blue
        '#5F9BCC', // Light Steel Blue
        '#B0E0E6', // Powder Blue
        '#4682B4', // Steel Blue
        '#1E90FF', // Dodger Blue
        '#ADD8E6', // Light Blue
    ],*/
    color: [
      '#FADADD', // Light Pink (pastel)
      '#F7A1C4', // Soft Pink
      '#FBD3E0', // Pastel Pink
      '#EBA0B3', // Pale Pink
      '#F3A6C9', // Baby Pink
      '#F9CFE0', // Blush Pink
  ],
      title: {
        top: 10,
        text: 'Motivos',
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
        top: 40,
      },
      series: [
        {
          bottom: -50,
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '70%'],
          // adjust the start and end angle
          startAngle: 180,
          endAngle: 360,
          data: [
            { value: 23136, name: 'Packaging' },
            { value: 18370, name: 'Mala calidad' },
            { value: 17224, name: 'Precio' },
            {value: 8130, name: 'No aplica'}
          ]
        }
      ]
    };

    option && myChart.setOption(option);
  }
}
