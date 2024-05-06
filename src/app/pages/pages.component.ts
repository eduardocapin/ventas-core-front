import {
  ChangeDetectorRef,
  Component,
  SimpleChanges,
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

  isExpanded = signal(true);

  sidenavWidth = computed(() => (this.isExpanded() ? '250px' : '66px'));

profilePicSice = computed(()=> this.isExpanded() ? '70' : '32');

  // public img: string | null = '';
  // public  cargo: string | null = '';
  // public username: string | null = '';

  ngOnInit(): void {
    // this.img = localStorage.getItem('img');
    // this.username = localStorage.getItem('user');
    // this.cargo = localStorage.getItem('cargo');
  }

}
