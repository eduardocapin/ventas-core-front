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
  LegendComponentOption
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
  LabelLayout
]);

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | PieSeriesOption
>;

@Component({
  selector: 'mobentis-grafica-semi-circulo',
  templateUrl: './grafica-semi-circulo.component.html',
  styleUrls: ['./grafica-semi-circulo.component.css']
})
export class GraficaSemiCirculoComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() titulo: string = '';
  @Input() valores: { value: number; name: string }[] = [];
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
    } else if (changes['valores']) {
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

    // Obtener colores desde las variables CSS
    const computedStyle = getComputedStyle(this.el.nativeElement);
    const colores = [
      computedStyle.getPropertyValue('--color-no-cumplidos').trim(),
      computedStyle.getPropertyValue('--color-pendientes').trim(),
      computedStyle.getPropertyValue('--color-cumplidos').trim(),
      computedStyle.getPropertyValue('--color-extra-1').trim(),
      computedStyle.getPropertyValue('--color-extra-2').trim(),
      computedStyle.getPropertyValue('--color-extra-3').trim()
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
      legend: {
        top: parseInt(computedStyle.getPropertyValue('--chart-legend-top')),
      },
      series: [
        {
          bottom: parseInt(computedStyle.getPropertyValue('--chart-bottom-offset')),
          type: 'pie',
          radius: [
            computedStyle.getPropertyValue('--chart-radius-inner').trim(),
            computedStyle.getPropertyValue('--chart-radius-outer').trim()
          ],
          center: [
            computedStyle.getPropertyValue('--chart-center-x').trim(),
            computedStyle.getPropertyValue('--chart-center-y').trim()
          ],
          startAngle: 180,
          endAngle: 360,
          data: this.valores,
        },
      ],
    };

    this.chart.setOption(option);
  }

  actualizarGrafica() {
    if (this.chart) {
      this.chart.setOption({
        series: [{ data: this.valores }],
      });
    }
  }
}