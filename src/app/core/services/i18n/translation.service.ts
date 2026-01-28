import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { dictionaries } from '../../../services/i18n/translations';
import { LanguageService } from '../language/language.service';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private currentLang = new BehaviorSubject<string>('es');
  public currentLang$ = this.currentLang.asObservable();
  private availableLanguageCodes: string[] = []; // Cache de códigos disponibles (se carga dinámicamente desde BD)

  constructor(
    private languageService: LanguageService,
    private injector: Injector,
    private http: HttpClient
  ) {
    // Por defecto español hasta que se obtenga del usuario logueado
    console.log('🔵 TranslationService inicializando - Idioma por defecto: es');
    this.loadAvailableLanguageCodes();
    this.currentLang.next('es');
  }

 
  public setLanguageInternal(lang: string) {
    if (this.isLanguageAvailable(lang)) {
      this.currentLang.next(lang);
      localStorage.setItem('lang', lang);
      localStorage.setItem('userLanguage', lang);
    } else {
      console.warn(`Idioma ${lang} no disponible, usando 'es' por defecto`);
      this.currentLang.next('es');
      localStorage.setItem('lang', 'es');
      localStorage.setItem('userLanguage', 'es');
    }
  }

  // Establecer idioma actual (llamado desde el selector, recarga la página)
  async setLanguage(lang: string) {
    console.log('TranslationService.setLanguage() llamado con idioma:', lang);
    this.setLanguageInternal(lang);
    
    // Actualizar en la base de datos si hay sesión activa
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    console.log('Token presente:', !!token, 'Email:', email);
    
    if (token && email) {
      try {
        // Lazy load del LoginService para evitar dependencia circular
        console.log('Cargando LoginService...');
        const { LoginService } = await import('../auth/login.service');
        const loginService = this.injector.get(LoginService);
        console.log('LoginService cargado, llamando a updateLanguage con:', lang);
        
        loginService.updateLanguage(lang).subscribe({
          next: (response: any) => {
            console.log('Idioma actualizado en la base de datos:', response);
            console.log('Recargando página en 500ms...');
            // Pequeño delay para que se vea el mensaje
            setTimeout(() => window.location.reload(), 500);
          },
          error: (error: any) => {
            console.error('Error al actualizar idioma en la base de datos:', error);
            console.log('Recargando página de todos modos...');
            // Recargar de todos modos para aplicar cambios locales
            setTimeout(() => window.location.reload(), 500);
          }
        });
      } catch (error) {
        console.error('Error al cargar LoginService:', error);
        console.log('Recargando página...');
        window.location.reload();
      }
    } else {
      console.warn('No hay sesión activa (token o email faltante), solo recargando');
      // Si no hay sesión activa, solo recargar
      window.location.reload();
    }
  }

  // Obtiene idioma actual
  getCurrentLanguage(): string {
    return this.currentLang.value;
  }

  // Traduce una key al idioma actual
  t(key: string, params?: { [k: string]: any }): string {
    const lang = this.currentLang.value;
    const dict = dictionaries[lang] || dictionaries['es'];
    let value = dict[key] || key;
    if (params) {
      Object.keys(params).forEach(p => {
        value = value.replace(new RegExp(`{{${p}}}`, 'g'), params[p]);
      });
    }
    return value;
  }

  // Inicializa el idioma desde la base de datos del usuario (NO recarga la página)
  async initializeFromUser(userLang: string | null) {
    if (userLang && this.isLanguageAvailable(userLang)) {
      this.setLanguageInternal(userLang);
    } else if (!userLang) {
      // Si el usuario no tiene idioma, obtener el idioma por defecto de la BD
      try {
        const defaultLang = await this.getDefaultLanguage().toPromise();
        this.setLanguageInternal(defaultLang || 'es');
      } catch (error) {
        console.error('Error al obtener idioma por defecto:', error);
        this.setLanguageInternal('es');
      }
    } else {
      // Idioma inválido, usar español
      this.setLanguageInternal('es');
    }
  }

  // Cargar códigos de idiomas disponibles (para validación)
  private loadAvailableLanguageCodes() {
    this.getAvailableLanguages().subscribe({
      next: (languages) => {
        this.availableLanguageCodes = languages.map(l => l.code);
        console.log('Códigos de idiomas disponibles cargados:', this.availableLanguageCodes);
      },
      error: (error) => {
        console.error('Error al cargar códigos de idiomas:', error);
        this.availableLanguageCodes = ['es']; // Fallback solo a español
      }
    });
  }

  // Verificar si un idioma está disponible
  private isLanguageAvailable(lang: string): boolean {
    return this.availableLanguageCodes.includes(lang) && dictionaries[lang] !== undefined;
  }

  // Obtener idiomas disponibles desde la base de datos
  getAvailableLanguages(): Observable<any[]> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      const parsedToken = JSON.parse(token);
      headers = headers.set('Authorization', `Bearer ${parsedToken}`);
    }
    
    return this.http.get<any>(`${environment.apiUrl}/api/configuration/languages`, { headers })
      .pipe(map((response: any) => response.data));
  }

  // Obtener idioma por defecto desde la base de datos
  getDefaultLanguage(): Observable<string> {
    return this.http.get<any>(`${environment.apiUrl}/api/configuration/default-language`)
      .pipe(map((response: any) => response.code));
  }
}
