import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/auth/login.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileEditPopupComponent } from '../configuration/configuration-general/profile-edit-popup/profile-edit-popup.component'; // Ajusta la ruta
import { MenuService } from '../services/menu/menu.service';
import { MenuItem }  from 'src/app/models/menuItem.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  menuOpen = false;
  profileMenuOpen = false; 

  menuItems: any[] = [];

  constructor(
    public _loginServices: LoginService,
    public _menuService: MenuService,
    private router: Router,
    public dialog: MatDialog
  ) {}

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
    const filteredItems = items.filter(item => item.parent_menu_id === parentId);
  
    // Recursión para submenús
    return filteredItems.map(item => ({
      ...item,
      isSubmenuOpen: false,
      submenuItems: this.mapItems(items, item.id)
    }));
  }

  closeMenu() {
    this.menuOpen = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
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

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

 

  onSearch(query: string) {
    // Implementa la lógica de búsqueda aquí
    console.log('Buscando:', query);
  }
}
