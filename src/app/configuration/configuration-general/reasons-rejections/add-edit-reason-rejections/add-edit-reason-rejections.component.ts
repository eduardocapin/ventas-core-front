import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { timeout } from 'rxjs';
import { IMotivoRechazo } from 'src/app/models/motivoRechazo.model';
import { MotivoRechazoService } from 'src/app/services/reasons_rejection/motivo-rechazo.service';



@Component({
  selector: 'app-add-edit-reason-rejections',
  templateUrl: './add-edit-reason-rejections.component.html',
  styleUrls: ['./add-edit-reason-rejections.component.css'],
})
export class AddEditReasonRejectionsComponent {
  reasonForm: FormGroup;
  motivoRechazo: IMotivoRechazo = {
    id: 0,
    rejection_code: '',
    rejection: '',
    internal_id: 0,
  };
  operacion: string = 'Agregar ';
  id: number | undefined;
  cargando: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AddEditReasonRejectionsComponent>,
    private form: FormBuilder,
    private _motivoRechazoService: MotivoRechazoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.reasonForm = this.form.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
    });
    this.id = data.id;
  }

  ngOnInit(): void {
    if (this.id !== undefined) {
      this.operacion = 'Editar ';
      this.cargando = true;
      this._motivoRechazoService
        .getReason(this.id)
        .pipe(timeout(20000))
        .subscribe(
          (data: IMotivoRechazo) => {
            this.motivoRechazo = data;
            this.reasonForm.patchValue({
              codigo: this.motivoRechazo.rejection_code,
              nombre: this.motivoRechazo.rejection,
            });
            this.cargando = false;
          },
          (error) => {
            // Maneja los errores adecuadamente
            console.error('Error al cargar los motivoss de rechazo', error);
            this.cargando = false;
          }
        );
    }
  }

  enviar() {
    if (this.reasonForm.status === 'VALID') {
      /* Obtener los valores del formulario */
      const nuevosDatos = this.reasonForm.value;
      /* Actualiza los el objeto IMotivosRechazo con los nuevos valores del formnulario */
      this.motivoRechazo.rejection_code = nuevosDatos.codigo;
      this.motivoRechazo.rejection = nuevosDatos.nombre;
      if (this.motivoRechazo.id === 0 || !this.motivoRechazo.id) {
        /* Si el ID es 0 o no está definido, es un nuevo motivo de rechazo, asi que insertamos */
        this._motivoRechazoService
          .insertReason(this.motivoRechazo)
          .subscribe((data) => {
            if (data == 'Success') {
              console.log(this.motivoRechazo);
              this.dialogRef.close(true);
            }
          });
      } else {
        /* Si el ID esta definido, es un motivo de rechazo existente, así que actualizamos */
        this._motivoRechazoService
          .updateReason(this.motivoRechazo)
          .subscribe((data) => {
            if (data == 'Success') {
              console.log(this.motivoRechazo);
              this.dialogRef.close(true);
            }
          });
      }
    }
  }

  hasErrors(controlName: string, errorType: string) {
    return (
      this.reasonForm.get(controlName)?.hasError(errorType) &&
      this.reasonForm.get(controlName)?.touched
    );
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
