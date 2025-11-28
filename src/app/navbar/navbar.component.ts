import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/auth/login.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileEditPopupComponent } from '../configuration/configuration-general/profile-edit-popup/profile-edit-popup.component';
import { MenuService } from '../services/menu/menu.service';
import { MenuItem } from 'src/app/models/menuItem.model';
import { AuthorizationService } from '../services/auth/authorization.service';
import { LanguageService } from '../services/language/language.service';
import { UsersService } from '../services/users/users.service';

@Component({
  selector: 'mobentis-navbar',
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
  
  // Idiomas disponibles
  selectedLanguage: string = 'es';
  languages = [
    { code: 'es', shortName: 'ES', longName: 'Español', flag: '' },
    { code: 'en', shortName: 'EN', longName: 'English', flag: '' },
    { code: 'ca', shortName: 'CA', longName: 'Català', flag: '' }
  ];

  handleToggleButton() {
    this.isToggled = !this.isToggled; /* Alterna entre fijo y comprimido */
    this.isHovered = false;
    this.updateNavbarState();
  }

  changeLanguage(langCode: string) {
    this.selectedLanguage = langCode;
    this.languageService.setLanguage(langCode);
    
    // Actualizar idioma en la base de datos
    this.usersService.updateUserLanguage(langCode).subscribe({
      next: (response) => {
        console.log('Idioma actualizado en BD:', response);
        // Recargar menús con el nuevo idioma
        this.loadMenuItems(langCode);
      },
      error: (error) => {
        console.error('Error al actualizar idioma:', error);
        console.error('Detalles del error:', {
          status: error.status,
          statusText: error.statusText,
          message: error.error?.message || error.message,
          body: error.error
        });
      }
    });
  }

  private loadMenuItems(language: string) {
    this._menuService.getMenuItems(1, language).subscribe(
      (items) => {
        if (items && Array.isArray(items)) {
          this.menuItems = this.mapItems(items, null);
        } else {
          this.menuItems = [];
        }
      },
      (error) => {
        console.error('Error al cargar menús:', error);
        this.menuItems = [];
      }
    );
  }

  getSelectedLanguage() {
    return this.languages.find(lang => lang.code === this.selectedLanguage);
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
    public dialog: MatDialog,
    private languageService: LanguageService,
    private usersService: UsersService
  ) {
    // Inicializar idioma desde localStorage
    this.selectedLanguage = this.languageService.getCurrentLanguage();
  }
  ngAfterViewInit() {
    this.closeNavbar();
  }

  ngOnInit(): void {
    // Cargar menús con el idioma actual del usuario
    const currentLanguage = this.languageService.getCurrentLanguage();
    this.loadMenuItems(currentLanguage);
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
    
    // Si es el item de usuarios, verificar roles O permisos
    if (item.route && (item.route.includes('users') || item.label === 'Users')) {
      return this.authorizationService.hasRole('Admin') || 
             this.authorizationService.hasPermission('VISUALIZADO_USUARIOS');
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
