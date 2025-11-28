import { Component, OnDestroy } from '@angular/core';
import { ConfigurationContainer } from 'src/app/models/configurationContainer.model';
import { ListItemService } from 'src/app/services/listItem/listItem.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'mobentis-configuration-general',
  templateUrl: './configuration-general.component.html',
  styleUrls: ['./configuration-general.component.scss'],
})
export class ConfigurationGeneralComponent implements OnDestroy {
  containers: ConfigurationContainer[] = [];
  private languageSubscription?: Subscription;

  constructor(
    private _listItemService: ListItemService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.loadContainers();
    
    // Suscribirse a cambios de idioma
    this.languageSubscription = this.languageService.currentLanguage$.subscribe(() => {
      this.loadContainers();
    });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  private loadContainers(): void {
    this._listItemService.getConfigContainers().subscribe((data) => {
      this.containers = data;
    });
  }
}
