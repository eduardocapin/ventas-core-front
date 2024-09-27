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
  selector: 'app-grafica-pedidos-segmentacion2',
  templateUrl: './grafica-pedidos-segmentacion2.component.html',
  styleUrls: ['./grafica-pedidos-segmentacion2.component.scss']
})
export class GraficaPedidosSegmentacion2Component {

  chart: echarts.ECharts | undefined;

  resize(){
    this.chart?.resize();
  }
  
  pintarGrafica() {

    let nombres: any = []
    let valores: any = []


    var chartDom = document.getElementById('pedidos-segmentacion2')!;
    var myChart = echarts.init(chartDom);
    this.chart = myChart;
    var option: EChartsOption;

    option = {
      grid: {
        bottom: 40
      },
      title: {
        text: "Tipología",
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
        data: ["Tienda Alimentacion Minorista", "Personal Empresa", "OCIO", "Mayoristas", "Bar/Tapas"],
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
          data: [10700, 15300, 6010, 24700, 10530],
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
