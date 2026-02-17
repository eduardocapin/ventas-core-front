import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, HostListener, OnDestroy, ElementRef } from '@angular/core';
import * as echarts from 'echarts/core';
import { GridComponent, GridComponentOption } from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GridComponent, BarChart, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<GridComponentOption | BarSeriesOption>;

@Component({
  selector: 'mobentis-grafica-barra-vertical',
  templateUrl: './grafica-barra-vertical.component.html',
  styleUrls: ['./grafica-barra-vertical.component.css'],
})
export class GraficaBarraVerticalComponent implements OnChanges, AfterViewInit, OnDestroy {

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
          bottom: 100,
          left: 50,
          right: 30,
          top: 50,
          containLabel: false,
        },
        title: {
          text: this.titulo,
          top: 10,
          left: 'center',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 15,
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          valueFormatter: (value: any) => {
            if (typeof value === 'number') {
              return value.toLocaleString('es-ES');
            }
            return value;
          }
        },
        xAxis: {
          type: 'category',
          data: this.categorias,
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 45,
            fontSize: 11,
            formatter: (value: string) => {
              if (!value) return '';
              return value.length > 25 ? value.substring(0, 25) + '...' : value;
            },
          },
          axisTick: {
            show: true,
            alignWithLabel: true,
          },
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dotted',
            },
          },
          axisLabel: {
            formatter: (value: number) => {
              if (value >= 1000000) {
                return (value / 1000000).toFixed(1) + 'M';
              } else if (value >= 1000) {
                return (value / 1000).toFixed(0) + 'k';
              }
              return value.toString();
            }
          }
        },
        series: [
          {
            color: '#87CEFA',
            data: this.valores,
            type: 'bar',
          },
        ],
      };

      this.chart.setOption(option);
    } else {
      console.error(`El elemento con ID ${this.elementoId} no se encontró en el DOM.`);
    }
  }

  actualizarGrafica() {
    if (this.chart) {
      this.chart.setOption({
        xAxis: {
          data: this.categorias,
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 45,
            fontSize: 11,
            formatter: (value: string) => {
              if (!value) return '';
              return value.length > 25 ? value.substring(0, 25) + '...' : value;
            },
          },
        },
        series: [{ data: this.valores }],
      });
    }
  }
}