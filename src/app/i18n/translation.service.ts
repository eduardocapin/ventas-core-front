import { Injectable } from '@angular/core';
import { LanguageService } from '../services/language/language.service';
import { dictionaries } from './translations';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private currentLang: string = 'es';

  constructor(private languageService: LanguageService) {
    this.currentLang = this.languageService.getCurrentLanguage();
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  t(key: string, params?: { [k: string]: any }): string {
    const dict = dictionaries[this.currentLang] || dictionaries['es'];
    let value = dict[key] || key;
    if (params) {
      Object.keys(params).forEach(p => {
        value = value.replace(new RegExp(`{{${p}}}`, 'g'), params[p]);
      });
    }
    return value;
  }
}
