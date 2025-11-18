import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { RechazadosService } from 'src/app/services/rechazados/rechazados.service';

@Component({
  selector: 'mobentis-corrective-action-status',
  templateUrl: './corrective-action-status.component.html',
  styleUrls: ['./corrective-action-status.component.scss'],
})
export class CorrectiveActionStatusComponent {
  @Input() statusId!: number;
  @Input() statusText!: string;
  @Input() rejectionId!: number;

  @Input() correctiveActionValue!: number; // Valor de la acción correctora
  @Input() correctiveActionSymbolId!: number; // Símbolo seleccionado
  @Input() correctiveActionText!: string; // Texto de la acción correctora
  @Input() canEnviar: boolean = true; // Permiso para enviar acción correctora

  @Output() beforeStatusChange = new EventEmitter<void>();
  @Output() statusChange = new EventEmitter<{
    statusId: number;
    statusText: string;
  }>();

  constructor(
    private _notifactionService: NotificationService,
    private _rechazadosService: RechazadosService
  ) {}

  handleStatusClick() {
    // Verificar si tiene permiso para enviar
    if (!this.canEnviar) {
      this._notifactionService.showWarning('No tiene permisos para enviar la acción correctora.');
      return;
    }

    // Validar los tres campos necesarios
    if (this.isRowComplete()) {
      if (this.statusId === 1) {
        const newStatus = { statusId: 2, statusText: 'Pendiente' };
        this.updateStatus(newStatus);
      } else {
        this._notifactionService.showWarning('El estado actual no permite cambios.');
      }
    } else {
      this._notifactionService.showWarning('Por favor, complete todos los campos antes de cambiar el estado.');
    }
  }

  // Función que valida los tres campos específicos
  isRowComplete(): boolean {
    return (
      this.correctiveActionValue > 0 && // El valor numérico es mayor a 0
      !!this.correctiveActionSymbolId && // El símbolo está seleccionado
      this.correctiveActionText?.trim().length > 0 // El texto no está vacío
    );
  }

  updateStatus(newStatus: { statusId: number; statusText: string }) {
    this._rechazadosService
      .updateEstadoAccionCorrectora(newStatus, this.rejectionId)
      .subscribe(
        (status) => {
          if (status === 'Success') {
            this._notifactionService.showSuccess(
              'Cambios guardados correctamente.'
            );
            this.statusChange.emit(newStatus);
          }
        },
        (error) => {
          console.error('Error al actualizar el rechazo:', error);
          this._notifactionService.showError('Error al guardar los cambios.');
        }
      );
  }
}
