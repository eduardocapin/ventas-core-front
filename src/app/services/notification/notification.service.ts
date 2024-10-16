import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) {}

  showSuccess(message: string) {
    this.toastr.success(message, 'Éxito');
  }

  showWarning(message: string) {
    this.toastr.warning(message, 'Advertencia');
  }

  showError(message: string) {
    this.toastr.error(message, 'Error');
  }
}

