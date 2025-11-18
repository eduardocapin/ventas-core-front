import { Component, Input } from '@angular/core';
import { ListItem } from 'src/app/models/listItem.model';

@Component({
  selector: 'mobentis-configuration-list-item-container',
  templateUrl: './configuration-list-item-container.component.html',
  styleUrls: ['./configuration-list-item-container.component.scss']
})
export class ConfigurationListItemContainerComponent {
  @Input() title!: string;
  @Input() items: ListItem[] = [];
  
}
