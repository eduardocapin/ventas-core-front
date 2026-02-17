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
    // Esperar a que el DOM esté completamente renderizado
    setTimeout(() => {
      this.pintarGrafica();
      
      const parentElement = this.el.nativeElement.parentElement;
      if (parentElement) {
        this.resizeObserver = new ResizeObserver(() => {
          this.resizeChart();
        });
        this.resizeObserver.observe(parentElement);
      }
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    // Si cambia el elementoId, destruir y recrear la gráfica
    if (changes['elementoId'] && !changes['elementoId'].firstChange) {
      this.destruirGrafica();
      setTimeout(() => this.pintarGrafica(), 100);
    } else if (changes['valores'] || changes['categorias']) {
      // Si los datos cambian, actualizar o recrear la gráfica
      if (this.chart && this.categorias.length > 0 && this.valores.length > 0) {
        this.actualizarGrafica();
      } else if (this.categorias.length > 0 && this.valores.length > 0) {
        // Si no hay gráfica pero hay datos, crear una nueva
        setTimeout(() => this.pintarGrafica(), 100);
      }
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
    // Validar que tenemos datos antes de renderizar
    if (!this.categorias || this.categorias.length === 0 || !this.valores || this.valores.length === 0) {
      console.warn('No hay datos para renderizar la gráfica');
      return;
    }

    const chartDom = document.getElementById(this.elementoId);
    if (!chartDom) {
      console.error(`El elemento con ID ${this.elementoId} no se encontró en el DOM.`);
      return;
    }

    // Asegurar que el contenedor tenga altura
    if (!chartDom.style.height || chartDom.style.height === '0px') {
      chartDom.style.height = '400px';
    }

    // Si ya existe una gráfica, destruirla primero
    if (this.chart) {
      this.chart.dispose();
    }

    this.chart = echarts.init(chartDom);

    const option: EChartsOption = {
      grid: {
        bottom: 40,
        top: 60,
        left: 100,
        right: 20,
        containLabel: true
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
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      yAxis: {
        type: 'category',
        data: this.categorias,
        axisLine: { show: true },
        axisLabel: { 
          show: true,
          interval: 0,
          rotate: 0,
          formatter: (value: string) => {
            // Truncar nombres largos
            return value.length > 20 ? value.substring(0, 20) + '...' : value;
          }
        },
        axisTick: { show: false },
        splitLine: { show: false }
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
          name: 'Valor',
          data: this.valores,
          type: 'bar',
          barWidth: '60%',
          label: {
            show: true,
            position: 'right',
            formatter: (params: any) => {
              return params.value.toLocaleString('es-ES', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              });
            }
          },
          itemStyle: {
            color: '#87CEFA'
          }
        }
      ]
    };

    this.chart.setOption(option);
  }

  actualizarGrafica() {
    // Validar que tenemos datos
    if (!this.categorias || this.categorias.length === 0 || !this.valores || this.valores.length === 0) {
      return;
    }

    if (this.chart) {
      this.chart.setOption({
        yAxis: { 
          data: this.categorias,
          axisLabel: {
            formatter: (value: string) => {
              return value.length > 20 ? value.substring(0, 20) + '...' : value;
            }
          }
        },
        series: [{ 
          data: this.valores,
          label: {
            formatter: (params: any) => {
              return params.value.toLocaleString('es-ES', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              });
            }
          }
        }]
      });
    } else {
      // Si no hay gráfica pero hay datos, crear una nueva
      setTimeout(() => this.pintarGrafica(), 100);
    }
  }
}