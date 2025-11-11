import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/auth/login.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileEditPopupComponent } from '../configuration/configuration-general/profile-edit-popup/profile-edit-popup.component'; // Ajusta la ruta
import { MenuService } from '../services/menu/menu.service';
import { MenuItem } from 'src/app/models/menuItem.model';
import { AuthorizationService } from '../services/auth/authorization.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @ViewChild('navbarNav', { static: false }) navbarNav!: ElementRef;
  menuOpen = false;
  profileMenuOpen = false;
  menuItems: any[] = [];

  /* apartado de navbar vertical */
  isToggled = false; /* Indica si el navbar está fijo */
  isHovered = false; /* Indica si el mouse está sobre el navbar */
  isCollapsed = true; /* Indica si el navbar está colapsado */
  isHovering = false;
  isButtonHovered = false;

  handleToggleButton() {
    this.isToggled = !this.isToggled; /* Alterna entre fijo y comprimido */
    this.isHovered = false;
    this.updateNavbarState();
  }

  onMouseEnter() {
    if (!this.isToggled) {
      this.isHovered = true;
      this.updateNavbarState();
    }
  }
  onMouseLeave() {
    this.isHovered = false;
    this.updateNavbarState();
  }
  /** Maneja cuando el mouse entra al botón */
  onButtonMouseEnter(event: MouseEvent) {
    const elementoOrigen = event.relatedTarget as HTMLElement;
    if (elementoOrigen.id == "sidenav") {
      this.isHovered = true;
    }
    this.isButtonHovered = true;
    this.updateNavbarState();
  }
  /** Maneja cuando el mouse sale del botón */
  onButtonMouseLeave() {
    this.isButtonHovered = false;
    this.isHovered = false;
    this.updateNavbarState();
  }
  updateNavbarState() {
    // Si está fijado o el mouse está sobre el navbar o el botón, el navbar se expande
    this.isCollapsed = !(
      this.isToggled ||
      this.isHovered ||
      this.isButtonHovered
    );
  }

  constructor(
    public _loginServices: LoginService,
    public _menuService: MenuService,
    public authorizationService: AuthorizationService,
    private router: Router,
    public dialog: MatDialog
  ) { }
  ngAfterViewInit() {
    this.closeNavbar();
  }

  ngOnInit(): void {
    this._menuService.getMenuItems(1, 'es').subscribe(
      (items) => {
        if (items && Array.isArray(items)) {
          this.menuItems = this.mapItems(items, null);
        } else {
          this.menuItems = [];
        }
      },
      (error) => {
        this.menuItems = [];
      }
    );
  }

  mapItems(items: any[], parentId: number | null): any[] {
    const filteredItems = items.filter(
      (item) => item.parent_menu_id === parentId
    );

    // Recursión para submenús con filtrado por roles
    return filteredItems
      .filter(item => this.shouldShowMenuItem(item))
      .map((item) => ({
        ...item,
        isSubmenuOpen: false,
        submenuItems: this.mapItems(items, item.id),
      }));
  }

  /**
   * Determinar si se debe mostrar un item del menú basándose en roles y permisos
   */
  shouldShowMenuItem(item: any): boolean {
    // Si es el item de configuración, verificar roles O permisos
    if (item.route && (item.route.includes('configuracion') || item.label === 'Configuración')) {
      return this.authorizationService.isAdminOrEditor() || 
             this.authorizationService.hasPermission('VISUALIZADO_CONFIGURACION');
    }
    
    // Por defecto, mostrar el item
    return true;
  }

  profilePicSize() {
    return '40'; // Tamaño del perfil, puedes ajustar esto si es necesario
  }

  openProfileEditPopup(): void {
    const dialogRef = this.dialog.open(ProfileEditPopupComponent, {
      width: 'auto',
      disableClose: true,
    });
  }

  logout() {
    this._loginServices.logout();
    this.router.navigateByUrl('/login');
  }

  // Método que cierra el menú
  closeNavbar() {
    const navbar = this.navbarNav?.nativeElement; // Usa `?` para evitar el error de inicialización
    if (navbar && navbar.classList.contains('show')) {
      // Aquí cerramos el colapso del menú
      const navbarToggler = document.querySelector(
        '.navbar-toggler'
      ) as HTMLElement;
      if (navbarToggler) {
        navbarToggler.click(); // Simula un clic en el toggler para cerrarlo
      }
    }
  }

  onSearch(query: string) {
    // Implementa la lógica de búsqueda aquí
    console.log('Buscando:', query);
  }
}
