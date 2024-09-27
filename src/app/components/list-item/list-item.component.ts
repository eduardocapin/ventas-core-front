import { Component, Input } from '@angular/core';
import { ListItem } from 'src/app/models/listItem.model';
import { ListItemService } from 'src/app/services/listItem/listItem.service';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent {
  @Input() listItem!: ListItem;
  constructor(private _listItemService: ListItemService) {}
  handlePopup(): void {
    if (this.listItem.type === 'popup' && this.listItem.popupFunction) {
      this._listItemService.executeFunction(this.listItem.popupFunction);
    }
  }
}
