import { Component } from '@angular/core';
import * as echarts from 'echarts/core';
import { GridComponent, GridComponentOption } from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { left } from '@popperjs/core';

echarts.use([GridComponent, BarChart, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
  GridComponentOption | BarSeriesOption
>;

@Component({
  selector: 'app-grafica-pedidos-dia',
  templateUrl: './grafica-pedidos-dia.component.html',
  styleUrls: ['./grafica-pedidos-dia.component.css']
})
export class GraficaPedidosDiaComponent {

  chart: echarts.ECharts | undefined;

  resize(){
    this.chart?.resize();
  }
  
  pintarGrafica() {
    let valores: any = ['0', '0', '0', '0', '0', '0', '0'];

    
    var chartDom = document.getElementById('pedidos-dia')!;
    var myChart = echarts.init(chartDom);
    this.chart = myChart;
    var option: EChartsOption;

    option = {
      grid: {
        bottom: 40,
        left: 50
      },
      title: {
        text: 'Por día de la semana',
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
        data: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dotted'
          }
        },
      },
      series:[
        
        {
          color: '#87CEFA',
          data: [12346, 15035, 9120, 6500, 6303, 9350, 8206],
          type: 'bar'
        }

      ]
    };

    option && myChart.setOption(option);
  }
}
