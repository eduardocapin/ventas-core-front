import {
  ChangeDetectorRef,
  Component,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  constructor(
    private router: Router,
    private observer: BreakpointObserver,
    private cd: ChangeDetectorRef
  ) {}

  isExpanded = signal(false);

  sidenavWidth = computed(() => (this.isExpanded() ? '250px' : '70px'));

  // Nueva propiedad para controlar la expansión del menú
  navExpanded: boolean = false;

  // Función para verificar si la ruta está activa
  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

}
