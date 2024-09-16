export interface MenuItem {
    id: number;
    parent_menu_id:number;
    label: string;
    route: string;
    hasSubmenu?: boolean;
    showSubmenu?: boolean; // Agregar esta propiedad
  }