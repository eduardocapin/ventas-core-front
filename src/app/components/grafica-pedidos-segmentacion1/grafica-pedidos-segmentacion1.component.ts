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
  selector: 'app-grafica-pedidos-segmentacion1',
  templateUrl: './grafica-pedidos-segmentacion1.component.html',
  styleUrls: ['./grafica-pedidos-segmentacion1.component.css']
})
export class GraficaPedidosSegmentacion1Component {

  chart: echarts.ECharts | undefined;

  resize(){
    this.chart?.resize();
  }
  
  pintarGrafica() {

    let nombres: any = []
    let valores: any = []


    var chartDom = document.getElementById('pedidos-segmentacion1')!;
    var myChart = echarts.init(chartDom);
    this.chart = myChart;
    var option: EChartsOption;

    option = {
      grid: {
        bottom: 40
      },
      title: {
        text: "Ponteciabilidad",
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
        data: ['D', 'C', 'B', 'A']
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
          data: [200, 120, 455, 320],
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
