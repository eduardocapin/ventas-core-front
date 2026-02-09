import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mobentis-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {
  @Input() item: any;
  @Input() isVertical: boolean = false;
  @Input() isExpanded: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  onMouseOver() {
    if (this.item.submenuItems?.length > 0) {
      // Para navbar horizontal siempre mostrar
      // Para navbar vertical solo si está expandido
      if (!this.isVertical || this.isExpanded) {
        this.item.isSubmenuOpen = true;
      }
    }
  }

  onMouseOut() {
    if (this.item.submenuItems?.length > 0) {
      this.item.isSubmenuOpen = false;
    }
  }
}