import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './translation.service';

@Pipe({
  name: 'translate',
  pure: false // Para que detecte cambios en el idioma
})
export class TranslatePipe implements PipeTransform {

  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    return this.translationService.translate(key);
  }
}
