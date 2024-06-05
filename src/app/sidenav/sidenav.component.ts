import { ChangeDetectorRef, Component, ViewChild, computed, signal } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { LoginService } from '../services/auth/login.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileEditPopupComponent } from '../configuration/configuration-general/profile-edit-popup/profile-edit-popup.component'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class PagesComponent {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  constructor(
    public _loginServices: LoginService,
    private router: Router,
    private observer: BreakpointObserver,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  isExpanded = signal(false);

  sidenavWidth = computed(() => (this.isExpanded() ? '250px' : '70px'));

  // Nueva propiedad para controlar la expansión del menú
  navExpanded: boolean = false;

  // Función para verificar si la ruta está activa
  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  // Método para cambiar el estado de la expansión del menú
  toggleNavExpansion(): void {
    this.navExpanded = !this.navExpanded;
    // Actualizar el estado del menú
    this.isExpanded.set(!this.isExpanded());
  }

  openProfileEditPopup(): void {
    const dialogRef = this.dialog.open(ProfileEditPopupComponent, {
      width: '400px',
      disableClose: true
    });
  }

  logout() {
    this._loginServices.logout();
    this.router.navigateByUrl('login');
  }
}
