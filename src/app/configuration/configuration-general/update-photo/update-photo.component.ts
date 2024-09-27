import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/auth/login.service';

@Component({
  selector: 'app-update-photo',
  templateUrl: './update-photo.component.html',
  styleUrls: ['./update-photo.component.scss']
})
export class UpdatePhotoComponent {
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  preview = '';

  imageInfos?: Observable<any>;

  constructor(public dialogRef: MatDialogRef<UpdatePhotoComponent>,

    private _loginServices: LoginService,

  ) { }

  selectFile(event: any): void {
    this.message = '';
    this.preview = '';
    this.progress = 0;
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }

  close(): void {
    this.message = '';
    this.currentFile = undefined;

  }


  upload(): void {
/*     this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this._uploadService.upload(this.currentFile).subscribe({
          next: (event: any) => {

            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
              //this.message = event.body;
              this.message = 'Archivo subido con éxito.'
            }
            this.update()
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'No se ha podido subir esta imagen';
            }

            this.currentFile = undefined;
          },
        });
      }

      this.selectedFiles = undefined;
    } */
  }

  cancelar() {
    this.dialogRef.close();
  }

  update(): void {
    /* if (this.currentFile) {
      this._loginServices.updateimg(this.currentFile.name).subscribe(data => {
        if (data === 'Success') {
          console.log('Actualizado')
        }
      })
    } */

  }
}