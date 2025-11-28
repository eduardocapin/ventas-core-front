import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './translation.service';

@Pipe({ name: 'translate', pure: false })
export class TranslatePipe implements PipeTransform {
  constructor(private translation: TranslationService) {}
  transform(key: string, params?: { [k: string]: any }): string {
    return this.translation.t(key, params);
  }
}
