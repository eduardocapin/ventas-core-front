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
  selector: 'app-grafica-pedidos-mes',
  templateUrl: './grafica-pedidos-mes.component.html',
  styleUrls: ['./grafica-pedidos-mes.component.scss']
})
export class GraficaPedidosMesComponent {

  chart: echarts.ECharts | undefined;

  resize(){
    this.chart?.resize();
  }
  
  pintarGrafica() {
    let valores: any = ['30','10','20','50','60','40','10','20','30','45','70','90']



    var chartDom = document.getElementById('pedidos-mes')!;
    var myChart = echarts.init(chartDom);
    this.chart = myChart;
    var option: EChartsOption;

    option = {
      grid: {
        bottom: 40,
        left: 50
      },
      title: {
        text: 'Por mes',
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
      xAxis: {
        type: 'category',
        data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      },
      yAxis: {
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
          data: [0, 0, 0, 0, 5860, 18000, 43000,],
          type: 'bar'
        }
      ]
    };

    option && myChart.setOption(option);
  }
}
