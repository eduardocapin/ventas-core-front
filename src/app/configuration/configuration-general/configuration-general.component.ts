import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileEditPopupComponent } from './profile-edit-popup/profile-edit-popup.component';
import { ReasonsRejectionsComponent } from './reasons-rejections/reasons-rejections.component';
import { ConfigurationContainer } from 'src/app/models/configurationContainer.model';
import { ListItemService } from 'src/app/services/listItem/listItem.service';

@Component({
  selector: 'app-configuration-general',
  templateUrl: './configuration-general.component.html',
  styleUrls: ['./configuration-general.component.scss'],
})
export class ConfigurationGeneralComponent {
  constructor(private _listItemService: ListItemService) {}
  containers: ConfigurationContainer[] = [];
  ngOnInit(): void {
    this._listItemService.getConfigContainers().subscribe((data) => {
      this.containers = data;
    });
  }
}
