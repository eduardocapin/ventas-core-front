import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {
  @Input() item: any;
  @Input() menuOpen: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  toggleSubmenu(item: any) {
    item.isSubmenuOpen = !item.isSubmenuOpen;
  }
  

}