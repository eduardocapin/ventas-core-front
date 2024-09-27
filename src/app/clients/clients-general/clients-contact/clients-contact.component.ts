import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { Contact } from 'src/app/models/clientContact.model';
import { ClientContactService } from 'src/app/services/clients/client-contact/client-contact.service';
import { timeout } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-clients-contact',
  templateUrl: './clients-contact.component.html',
  styleUrls: ['./clients-contact.component.scss'],
})
export class ClientsContactComponent {

  id_contacto: number = 0;
  inactivo: boolean = false;
  form: any;
  cargando: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ClientsContactComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _clientContactServices: ClientContactService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      nombre: [''],
      telefono_1: [''],
      telefono_2: [''],
      email: [''],
    });

    this.id_contacto = data.id;
  }
  ngOnInit(): void {
    this.cargando = true;
    this._clientContactServices
      .getOneContact(this.id_contacto)
      .pipe(timeout(20000))
      .subscribe(
        (data: Contact) => {
          this.form.patchValue({
            nombre: data.name,
            telefono_1: data.phone_1,
            telefono_2: data.phone_2,
            email: data.email,
          });
          this.inactivo = data.deleted;
          this.cargando = false;
        },
        (error) => {
          console.error('Error al asignar el dataSource:', error);
          this.cargando = false;
        }
      );
  }

  cancelar() {
    this.dialogRef.close({
      editado: false,
      id: this.id_contacto,
    });
  }

  aceptar() {
    this.dialogRef.close({
      editado: true,
      id: this.id_contacto,
    });
  }

}
