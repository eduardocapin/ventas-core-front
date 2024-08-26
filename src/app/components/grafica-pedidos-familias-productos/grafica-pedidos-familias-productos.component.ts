import { Component } from '@angular/core';
import * as echarts from 'echarts/core';
import { GridComponent, GridComponentOption } from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GridComponent, BarChart, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
  GridComponentOption | BarSeriesOption
>;

@Component({
  selector: 'app-grafica-pedidos-familias-productos',
  templateUrl: './grafica-pedidos-familias-productos.component.html',
  styleUrls: ['./grafica-pedidos-familias-productos.component.scss']
})
export class GraficaPedidosFamiliasProductosComponent {

  chart: echarts.ECharts | undefined;

  resize(){
    this.chart?.resize();
  }
  
  pintarGrafica() {

    let nombres: any = []
    let valores: any = []


    var chartDom = document.getElementById('pedidos-familias-productos')!;
    var myChart = echarts.init(chartDom);
    this.chart = myChart;
    var option: EChartsOption;

    option = {
      grid: {
        bottom: 40
      },
      title: {
        text: 'Familias de productos',
        top: 10,
        left: 'center',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 15
        }
      },
      tooltip: {
        trigger: 'item'
      },
      yAxis: {
        type: 'category',
        axisLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        data: ['Conservas', 'Verduras', 'Congelados', 'Vinos', 'Carnes', 'Frutas']
      },
      xAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dotted'
          }
        },
      },
      series: [
        {
          color: '#87CEFA',
          data: [120, 200, 150, 80, 70, 110, 0, 0, 20, 34],
          type: 'bar',
          label: {
            show: true,
            position: 'insideLeft',
            formatter: '{b}'
          },
        }
      ]
    };

    option && myChart.setOption(option);
  }
}
