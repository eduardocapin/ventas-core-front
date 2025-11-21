import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class SessionInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Detecta que la sesion es invalida
        if (error.status === 401 && error.error?.code === 'SESSION_INVALIDATED') {
          // Limpiar localStorage
          localStorage.clear();
          
         
          this.notificationService.showWarning('Tu sesión ha sido cerrada porque iniciaste sesión en otro dispositivo');
          
          // Redirige al login
          this.router.navigate(['/auth/login']);
        }
        
        return throwError(() => error);
      })
    );
  }
}
