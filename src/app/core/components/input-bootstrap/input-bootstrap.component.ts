import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'mobentis-input-bootstrap',
  templateUrl: './input-bootstrap.component.html',
  styleUrls: ['./input-bootstrap.component.scss']
})
export class InputBootstrapComponent implements OnInit {
  isFocused: boolean = false;
  isHidden: boolean = true;
  showToggle: boolean = false;
  fileName: string | null = null;

  @Input() minRows = 1;
  @Input() maxRows = 5;

  // Reactivo
  @Input() form?: FormGroup;
  @Input() controlName?: string;

  // Independiente
  @Input() value?: string;
  @Output() valueChange = new EventEmitter<string>();

  //Estilos (opcional)
  @Input() wrapperStyle: { [klass: string]: any } | null = null;
  @Input() wrapperClass: string | string[] | Set<string> | { [klass: string]: any } = '';

  @Input() label!: string;
  @Input() readonly: boolean = false;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() customErrors: { [key: string]: string } = {};
  @Input() showErrors: boolean = true;
  @Input() min?: number;
  @Input() max?: number;
  @Input() step?: number;
  @Input() tooltip?: string;
  @Input() iconRight?: string;
  @Input() accept: string = '';
  @Input() multiple: boolean = false;
  @Output() input = new EventEmitter<Event>();

  @Output() fileChange = new EventEmitter<File>();

  

  ngOnInit() {
    this.showToggle = this.type === 'password';
  }

  toggleVisibility() {
    if (this.showToggle) {
      this.isHidden = !this.isHidden;
    }
  }

  get inputType(): string {
    return this.showToggle && !this.isHidden ? 'text' : this.type;
  }

  get control(): FormControl | null {
    if (this.form && this.controlName) {
      return this.form.get(this.controlName) as FormControl;
    }
    return null;
  }

  get isRequired(): boolean {
    const validator = this.control?.validator?.({} as any);
    return validator?.['required'] ?? false;
  }

  private patternErrors: { [key: string]: string } = {
    telefono1: 'Teléfono inválido',
    telefono2: 'Teléfono inválido',
    cp: 'Código postal inválido',
    cif: 'CIF inválido',
  };

  get errorMessageToShow(): string | null {
    if (!this.control || !(this.control.touched || this.control.dirty)) return null;

    if (this.control.hasError('required')) return 'Campo requerido';
    if (this.control.hasError('pattern')) {
      return this.patternErrors[this.controlName!] || 'Caracteres no válidos';
    }
    if (this.control.hasError('email')) return 'Correo inválido';

    return null;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      this.fileName = Array.from(files).map(f => f.name).join(', ');
      this.control?.setValue(this.fileName);
      this.fileSelected.emit(files);
    }
  }
  @Output() fileSelected = new EventEmitter<FileList>();
}
