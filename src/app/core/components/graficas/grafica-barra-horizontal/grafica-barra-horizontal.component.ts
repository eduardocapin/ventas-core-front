import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, HostListener, OnDestroy, ElementRef } from '@angular/core';
import * as echarts from 'echarts/core';
import { GridComponent, GridComponentOption } from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GridComponent, BarChart, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<GridComponentOption | BarSeriesOption>;

@Component({
  selector: 'mobentis-grafica-barra-horizontal',
  templateUrl: './grafica-barra-horizontal.component.html',
  styleUrls: ['./grafica-barra-horizontal.component.css']
})
export class GraficaBarraHorizontalComponent implements OnChanges, AfterViewInit, OnDestroy {

  @Input() titulo: string = '';
  @Input() categorias: string[] = [];
  @Input() valores: number[] = [];
  @Input() elementoId: string = '';

  private resizeObserver!: ResizeObserver;
  chart: echarts.ECharts | undefined;

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    this.pintarGrafica();

    const parentElement = this.el.nativeElement.parentElement;

    this.resizeObserver = new ResizeObserver(() => {
      this.resizeChart();
    });

    this.resizeObserver.observe(parentElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    // Si cambia el elementoId, destruir y recrear la gráfica
    if (changes['elementoId'] && !changes['elementoId'].firstChange) {
      this.destruirGrafica();
      setTimeout(() => this.pintarGrafica(), 0);
    } else if (changes['valores'] || changes['categorias']) {
      this.actualizarGrafica();
    }
  }

  destruirGrafica() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = undefined;
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.destruirGrafica();
  }

  resizeChart() {
    if (this.chart) {
      this.chart.resize();
    }
  }

  pintarGrafica() {
    const chartDom = document.getElementById(this.elementoId);
    if (chartDom) {
      this.chart = echarts.init(chartDom);

      const option: EChartsOption = {
        grid: {
          bottom: 40
        },
        title: {
          text: this.titulo,
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
          data: this.categorias
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
            data: this.valores,
            type: 'bar',
            label: {
              show: true,
              position: 'insideLeft',
              formatter: '{b}'
            },
          }
        ]
      };

      this.chart.setOption(option);
    } else {
      console.error(`El elemento con ID ${this.elementoId} no se encontró en el DOM.`);
    }
  }

  actualizarGrafica() {
    if (this.chart) {
      this.chart.setOption({
        yAxis: { data: this.categorias },
        series: [{ data: this.valores }]
      });
    }
  }
}