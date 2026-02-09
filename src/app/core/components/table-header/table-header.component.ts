import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IHeaderItem } from 'src/app/models/tableHeader.model';

@Component({
  selector: 'mobentis-table-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss']
})
export class TableHeaderComponent {
  @Input() headers: IHeaderItem[] = [];
  @Input() _id: string = '';
  @Input() parentAccordion: string = '';
  

  // Método para generar ID único si no se proporciona
  ngOnInit() {
    if (!this._id) {
      this._id = 'header_' + Math.random().toString(36).substr(2, 9);
    }
  }
}