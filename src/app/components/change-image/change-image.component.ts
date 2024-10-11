import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-change-image',
  templateUrl: './change-image.component.html',
  styleUrls: ['./change-image.component.css']
})
export class ChangeImageComponent {
  @Input() defaultImage: string = 'assets/images/user.png'; 
  @Input() preview: string | null = '';
  @Output() upload = new EventEmitter<File>();
  @Output() fileSelected = new EventEmitter<boolean>(); 
  selectedFiles?: FileList;
  currentFile?: File;

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  selectFile(event: any): void {
    this.preview = '';
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file && file.type.startsWith('image/')) {
        this.currentFile = file;
        this.fileSelected.emit(true); 
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      } else {
        this.currentFile = undefined;
        this.preview = null
        this.fileSelected.emit(false); 
      }
    }
  }

  onUpload(): void {
    if (this.currentFile) {
      this.upload.emit(this.currentFile);
      this.currentFile = undefined;
      this.fileSelected.emit(false); 
    }
  }
  
}

