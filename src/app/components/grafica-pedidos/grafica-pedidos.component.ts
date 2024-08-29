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
  selector: 'app-grafica-pedidos',
  templateUrl: './grafica-pedidos.component.html',
  styleUrls: ['./grafica-pedidos.component.css']
})
export class GraficaPedidosComponent {

  chart: echarts.ECharts | undefined;

  resize(){
    this.chart?.resize();
  }
  
  pintarGrafica() {
    var pedidosConfirmados = 0
    var pedidosRechazados = 0
    var pedidosPendientes = 0

    var chartDom = document.getElementById('main2')!;
    var myChart = echarts.init(chartDom);
    this.chart = myChart;
    var option: EChartsOption;

    option = {
      color: [
        '#87CEFA', // Light Sky Blue
        '#5F9BCC', // Light Steel Blue
        '#B0E0E6', // Powder Blue
        '#4682B4', // Steel Blue
        '#1E90FF', // Dodger Blue
        '#ADD8E6', // Light Blue
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
            { value: 735, name: 'Caducado' },
            { value: 280, name: 'Mala calidad' },
            { value: 280, name: 'Precio' },
            {value: 280, name: 'No aplica'}
          ]
        }
      ]
    };

    option && myChart.setOption(option);
  }
}
