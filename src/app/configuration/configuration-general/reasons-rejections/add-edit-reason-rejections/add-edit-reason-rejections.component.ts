import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface IMotivoRechazo {
  id: number;
  codigo: string;  // Renombrado para que coincida con la interfaz de ReasonsRejectionsComponent
  nombre: string;  // Renombrado para que coincida con la interfaz de ReasonsRejectionsComponent
}

@Component({
  selector: 'app-add-edit-reason-rejections',
  templateUrl: './add-edit-reason-rejections.component.html',
  styleUrls: ['./add-edit-reason-rejections.component.css'],
})
export class AddEditReasonRejectionsComponent {
  reasonForm: FormGroup;
  motivoRechazo: IMotivoRechazo;
  operacion: string = 'Agregar ';
  cargando: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddEditReasonRejectionsComponent>,
    private form: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { motivoRechazo: IMotivoRechazo }
  ) {
    this.motivoRechazo = data.motivoRechazo || { id: 0, codigo: '', nombre: '' };
    this.reasonForm = this.form.group({
      codigo: [this.motivoRechazo.codigo, Validators.required],
      nombre: [this.motivoRechazo.nombre, [Validators.required, Validators.maxLength(24)]],
    });
  }

  ngOnInit(): void {
    if (this.motivoRechazo.id !== 0) {
      this.operacion = 'Editar ';
    }
  }

  enviar() {
    if (this.reasonForm.status === 'VALID') {
      const nuevosDatos = this.reasonForm.value;
      this.motivoRechazo.codigo = nuevosDatos.codigo;
      this.motivoRechazo.nombre = nuevosDatos.nombre;

      console.log(
        this.motivoRechazo.id === 0 ? 'Insertando' : 'Actualizando',
        'motivo de rechazo:',
        this.motivoRechazo
      );

      this.dialogRef.close(true);
    }
  }

  cancelar() {
    this.dialogRef.close(false);
  }

  hasErrors(controlName: string, errorType: string): boolean {
    const control = this.reasonForm.get(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }
}
