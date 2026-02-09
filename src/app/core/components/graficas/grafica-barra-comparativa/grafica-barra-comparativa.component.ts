import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, HostListener, OnDestroy, ElementRef } from '@angular/core';
import * as echarts from 'echarts/core';
import { GridComponent, GridComponentOption, LegendComponent, LegendComponentOption, DataZoomComponent, DataZoomComponentOption } from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GridComponent, LegendComponent, DataZoomComponent, BarChart, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<GridComponentOption | LegendComponentOption | BarSeriesOption | DataZoomComponentOption>;

@Component({
  selector: 'mobentis-grafica-barra-comparativa',
  templateUrl: './grafica-barra-comparativa.component.html',
  styleUrls: ['./grafica-barra-comparativa.component.css']
})
export class GraficaBarraComparativaComponent implements OnChanges, AfterViewInit, OnDestroy {

  @Input() titulo: string = '';
  @Input() categorias: string[] = [];
  @Input() valoresSerie1: number[] = []; // Por ejemplo: Ventas
  @Input() valoresSerie2: number[] = []; // Por ejemplo: Objetivos
  @Input() nombreSerie1: string = 'Serie 1';
  @Input() nombreSerie2: string = 'Serie 2';
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
    if (changes['valoresSerie1'] || changes['valoresSerie2'] || changes['categorias']) {
      this.actualizarGrafica();
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  resizeChart() {
    if (this.chart) {
      this.chart.resize();
    }
  }

  pintarGrafica() {
    const chartDom = document.getElementById(this.elementoId);
    if (chartDom) {
      // Calcular el valor máximo de todas las series para fijar el eje Y
      const maxValue = Math.max(
        ...this.valoresSerie1,
        ...this.valoresSerie2
      );
      const yAxisMax = Math.ceil(maxValue * 1.15); // 15% más alto que el máximo

      // Configurar ancho fijo de la gráfica basado en número de categorías
      const numCategorias = this.categorias.length;
      const necesitaScroll = numCategorias > 6;
      
      // Si hay más de 6 categorías, hacer el contenedor más ancho para activar scroll
      if (necesitaScroll) {
        const anchoMinimo = numCategorias * 100; // 100px por categoría para evitar superposición
        chartDom.style.width = `${anchoMinimo}px`;
        chartDom.style.height = '100%';
      } else {
        chartDom.style.width = '100%';
        chartDom.style.height = '100%';
      }

      this.chart = echarts.init(chartDom);

      const option: EChartsOption = {
        grid: {
          bottom: necesitaScroll ? 55 : 40,
          left: 50,
          right: 30,
          top: 20
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: this.categorias,
          axisLabel: {
            interval: 0,
            rotate: necesitaScroll ? 25 : 0,
            fontSize: 11,
            margin: 8,
            overflow: 'none'
          },
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: yAxisMax,
          splitLine: {
            lineStyle: {
              type: 'dotted',
            },
          },
        },
        animation: false,
        series: [
          {
            name: this.nombreSerie1,
            type: 'bar',
            data: this.valoresSerie1,
            color: '#87CEFA',
            barGap: '10%',
            itemStyle: {
              borderRadius: [4, 4, 0, 0]
            }
          },
          {
            name: this.nombreSerie2,
            type: 'bar',
            data: this.valoresSerie2,
            color: '#4A90E2',
            itemStyle: {
              borderRadius: [4, 4, 0, 0]
            }
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
        xAxis: { data: this.categorias },
        series: [
          { data: this.valoresSerie1 },
          { data: this.valoresSerie2 }
        ],
      });
    }
  }
}
