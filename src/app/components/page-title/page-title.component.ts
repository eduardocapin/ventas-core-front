import { Component, Input } from '@angular/core';

@Component({
  selector: 'mobentis-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() isBootstrapIcon: boolean = false;
}
