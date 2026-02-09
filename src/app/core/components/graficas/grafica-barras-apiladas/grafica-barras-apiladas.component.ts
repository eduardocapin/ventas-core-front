import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
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
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption,
} from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
]);

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | BarSeriesOption
>;

@Component({
  selector: 'mobentis-grafica-barras-apiladas',
  templateUrl: './grafica-barras-apiladas.component.html',
  styleUrls: ['./grafica-barras-apiladas.component.css'],
})
export class GraficaBarrasApiladasComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() titulo: string = '';
  @Input() datos: { name: string; value: number }[] = [];
  @Input() elementoId: string = '';

  private resizeObserver!: ResizeObserver;
  chart: echarts.ECharts | undefined;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.pintarGrafica();

    const parentElement = this.el.nativeElement.parentElement;

    this.resizeObserver = new ResizeObserver(() => {
      this.resizeChart();
    });

    this.resizeObserver.observe(parentElement);
  }

  ngOnChanges(changes: SimpleChanges) {
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
    const chartDom = document.getElementById(this.elementoId);
    if (!chartDom) return;
    
    this.chart = echarts.init(chartDom);

    const computedStyle = getComputedStyle(this.el.nativeElement);

    // Colores en tonos azules pasteles suaves
    const coloresAzules = [
      '#7DC3F7', // Azul pastel suave - para valores negativos/perdidos
      '#87CEFA', // Azul cielo pastel - para valores neutros/nuevos
      '#93D5FA', // Azul claro pastel - para valores positivos/activos
    ];

    const option: EChartsOption = {
      color: coloresAzules,
      title: {
        text: this.titulo,
        left: 'center',
        top: 10,
        textStyle: {
          fontWeight: computedStyle.getPropertyValue('--chart-title-weight').trim() as any,
          fontSize: parseInt(computedStyle.getPropertyValue('--chart-title-size')),
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          const item = params[0];
          return `<strong>${item.name}</strong><br/>${item.marker} ${item.value}`;
        },
      },
      legend: {
        top: 40,
        left: 'center',
      },
      grid: {
        left: '12%',
        right: '5%',
        bottom: '5%',
        top: 55,
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        show: false,
      },
      yAxis: {
        type: 'category',
        data: this.datos.map(item => item.name),
        axisLabel: {
          fontSize: 12,
          fontWeight: 'normal',
        },
      },
      series: [{
        type: 'bar',
        data: this.datos.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: coloresAzules[index],
            borderRadius: [0, 10, 10, 0],
          },
        })),
        label: {
          show: true,
          formatter: '{c}',
          position: 'right',
          fontSize: 12,
          fontWeight: 'normal',
        },
        emphasis: {
          focus: 'self',
        },
        barWidth: '60%',
      }],
    };

    this.chart.setOption(option);
  }

  actualizarGrafica() {
    if (this.chart && this.datos) {
      const coloresAzules = [
        '#7DC3F7',
        '#87CEFA',
        '#93D5FA',
      ];

      this.chart.setOption({
        yAxis: {
          data: this.datos.map(item => item.name),
        },
        series: [{
          type: 'bar',
          data: this.datos.map((item, index) => ({
            value: item.value,
            itemStyle: {
              color: coloresAzules[index],
              borderRadius: [0, 10, 10, 0],
            },
          })),
        }]
      });
    }
  }
}
