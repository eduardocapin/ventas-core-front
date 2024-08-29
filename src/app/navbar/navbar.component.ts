import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/auth/login.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileEditPopupComponent } from '../configuration/configuration-general/profile-edit-popup/profile-edit-popup.component'; // Ajusta la ruta

interface SubMenuItem {
  label: string;
  route: string;
}

interface MenuItem {
  label: string;
  route: string;
  hasSubmenu?: boolean;
  submenuItems?: SubMenuItem[];
  showSubmenu?: boolean; // Agregar esta propiedad
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  menuOpen = false;
  profileMenuOpen = false; // Nueva propiedad para manejar el menú de perfil


  menuItems: MenuItem[] = [
    { label: 'Dashboard', route: 'dashboard/global' },
    { label: 'Converter', route: 'rechazos/global' },
    { 
      label: 'Clientes', 
      route: 'clientes/global', 
      hasSubmenu: true, 
      submenuItems: [
        { label: 'Cliente 1', route: 'clientes/global/subcliente1' },
        { label: 'Cliente 2', route: 'clientes/global/subcliente2' }
      ],
      showSubmenu: false
    },
    { label: 'Configuración', route: 'configuracion/global' }
  ];

  constructor(
    public _loginServices: LoginService,
    private router: Router,
    public dialog: MatDialog
  ) {}


  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  closeMenu(){
    this.menuOpen = false;
  }

  profilePicSize() {
    return '40'; // Tamaño del perfil, puedes ajustar esto si es necesario
  }

  openProfileEditPopup(): void {
    const dialogRef = this.dialog.open(ProfileEditPopupComponent, {
      width: 'auto',
      disableClose: true
    });
  }

  logout() {
    this._loginServices.logout();
    this.router.navigateByUrl('/login');
  }

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  toggleDropdown(item: MenuItem) {
    if (item.hasSubmenu) {
      item.showSubmenu = true; // Mostrar el submenú
    }
  }

  hideDropdown(item: MenuItem) {
    if (item.hasSubmenu) {
      item.showSubmenu = false; // Ocultar el submenú
    }
  }

  onSearch(query: string) {
    // Implementa la lógica de búsqueda aquí
    console.log('Buscando:', query);
  }
}
