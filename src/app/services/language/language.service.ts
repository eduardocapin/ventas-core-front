import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject: BehaviorSubject<string>;
  public currentLanguage$: Observable<string>;

  constructor() {
    // Inicializar con el idioma guardado en localStorage o 'es' por defecto
    const savedLanguage = localStorage.getItem('userLanguage') || 'es';
    this.currentLanguageSubject = new BehaviorSubject<string>(savedLanguage);
    this.currentLanguage$ = this.currentLanguageSubject.asObservable();
  }

  /**
   * Obtener el idioma actual
   */
  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  /**
   * Establecer el idioma (sin persistir en BD, solo local)
   */
  setLanguage(language: string): void {
    if (['es', 'en', 'ca'].includes(language)) {
      this.currentLanguageSubject.next(language);
      localStorage.setItem('userLanguage', language);
    }
  }

  /**
   * Obtener el idioma desde el login (cuando el usuario inicia sesión)
   */
  initLanguageFromLogin(idioma: string | null): void {
    const lang = idioma || 'es';
    this.currentLanguageSubject.next(lang);
    localStorage.setItem('userLanguage', lang);
  }
}
