import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  HostListener,
  OnDestroy,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
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
  LabelLayout,
]);

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | PieSeriesOption
>;
@Component({
  selector: 'mobentis-grafica-pastel',
  templateUrl: './grafica-pastel.component.html',
  styleUrls: ['./grafica-pastel.component.css'],
})
export class GraficaPastelComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() titulo: string = '';
  @Input() datos: { value: number; name: string }[] = [];
  @Input() elementoId: string = '';
  @Input() mostrarLeyenda: boolean = true;

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
    } else if (changes['datos']) {
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
    const chartDom = document.getElementById(this.elementoId)!;
    this.chart = echarts.init(chartDom);

    // Obtener colores y configuración desde las variables CSS
    const computedStyle = getComputedStyle(this.el.nativeElement);
    const colores = [
      computedStyle.getPropertyValue('--color-primary').trim(),
      computedStyle.getPropertyValue('--color-secondary').trim(),
      computedStyle.getPropertyValue('--color-tertiary').trim(),
      computedStyle.getPropertyValue('--color-quaternary').trim(),
      computedStyle.getPropertyValue('--color-quinary').trim(),
      computedStyle.getPropertyValue('--color-senary').trim()
    ];

    const option: EChartsOption = {
      color: colores,
      title: {
        top: 10,
        text: this.titulo,
        left: 'center',
        textStyle: {
          fontWeight: computedStyle.getPropertyValue('--chart-title-weight').trim() as any,
          fontSize: parseInt(computedStyle.getPropertyValue('--chart-title-size')),
        },
      },
      tooltip: {
        trigger: 'item',
      },
      legend: this.mostrarLeyenda ? {
        orient: 'horizontal',
        top: parseInt(computedStyle.getPropertyValue('--chart-legend-top')),
      } : {
        show: false
      },
      series: [
        {
          bottom: parseInt(computedStyle.getPropertyValue('--chart-bottom-offset')),
          type: 'pie',
          radius: computedStyle.getPropertyValue('--chart-radius').trim(),
          data: this.datos,
          emphasis: {
            focus: 'self',
            blurScope: 'coordinateSystem',
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
            scale: true,
            scaleSize: 10,
          },
          blur: {
            itemStyle: {
              opacity: 0.5,
            },
          },
        },
      ],
    };

    this.chart.setOption(option);
  }

  actualizarGrafica() {
    if (this.chart) {
      // Limpiar cualquier estado de hover previo
      this.chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0
      });
      
      this.chart.setOption({
        series: [{
          data: this.datos,
          type: 'pie'
        }]
      });
      // Forzar repintado completo
      this.chart.resize();
    }
  }
}
