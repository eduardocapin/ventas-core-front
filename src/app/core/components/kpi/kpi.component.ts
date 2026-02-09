import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'mobentis-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.scss']
})
export class KPIComponent implements AfterViewInit {
  @ViewChild('graficasIzquierda') graficasIzquierda!: ElementRef;
  @ViewChild('graficasDerecha') graficasDerecha!: ElementRef;

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