import { Component, AfterViewInit, ElementRef, ViewChild, SimpleChanges, Input } from '@angular/core';
import { RejectionKPIs } from 'src/app/models/RejectionKPI.model';
import { RechazadosService } from 'src/app/services/rechazados/rechazados.service';

@Component({
  selector: 'mobentis-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.scss']
})
export class KPIComponent implements AfterViewInit {
  @ViewChild('graficasIzquierda') graficasIzquierda!: ElementRef;
  @ViewChild('graficasDerecha') graficasDerecha!: ElementRef;
  kpiData: RejectionKPIs = {
    totalRejections: 0,
    rejectionByReason: [],
    pendingRejections: 0,
    opportunityRejections: 0,
    totalGroupedConversions: 0,
    conversionsByStatus: []
  };
  @Input() selectedFilters!: { [key: string]: any };
  @Input() searchTerm!: string;

constructor(
    private rejectionService: RechazadosService,
   
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Cuando los filtros o el término de búsqueda cambian, actualiza los KPIs
    if (changes['selectedFilters'] || changes['searchTerm']) {
      this.loadKPIs();
    }
  }

  loadKPIs(){
    this.rejectionService
          .getKPIs(
            this.selectedFilters,
            this.searchTerm
          )
          .subscribe((data: any) => {
            console.log('KPIS cargados:', data);
            this.kpiData = data;
    
            
    
           
          });
  }
  
  ngOnInit(){
    this.loadKPIs();
  }

  ngAfterViewInit(): void {
    this.enableHorizontalScroll(this.graficasIzquierda.nativeElement);
    this.enableHorizontalScroll(this.graficasDerecha.nativeElement);
  }

  private enableHorizontalScroll(element: HTMLElement): void {
    // Scroll con la rueda del ratón
    element.addEventListener('wheel', (event: WheelEvent) => {
      if (event.deltaY !== 0) {
        event.preventDefault(); // Evita el scroll vertical
        element.scrollLeft += event.deltaY; // Scroll horizontal
      }
    });

    // Scroll arrastrando con el ratón
    let isMouseDown = false;
    let startX = 0;
    let scrollLeft = 0;

    element.addEventListener('mousedown', (event: MouseEvent) => {
      isMouseDown = true;
      startX = event.pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
      element.style.cursor = 'grabbing'; // Cambia el cursor al arrastrar
    });

    element.addEventListener('mouseleave', () => {
      isMouseDown = false;
      element.style.cursor = 'default';
    });

    element.addEventListener('mouseup', () => {
      isMouseDown = false;
      element.style.cursor = 'default';
    });

    element.addEventListener('mousemove', (event: MouseEvent) => {
      if (!isMouseDown) return;
      event.preventDefault();
      const x = event.pageX - element.offsetLeft;
      const walk = x - startX; // Distancia del desplazamiento
      element.scrollLeft = scrollLeft - walk;
    });
  }
}