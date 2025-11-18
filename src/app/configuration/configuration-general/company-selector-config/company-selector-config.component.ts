import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'mobentis-company-selector-config',
  templateUrl: './company-selector-config.component.html',
  styleUrls: ['./company-selector-config.component.scss']
})
export class CompanySelectorConfigComponent implements OnInit {
  
  isEnabled: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<CompanySelectorConfigComponent>
  ) { }

  ngOnInit(): void {
    // Leer el estado desde localStorage
    const stored = localStorage.getItem('empresaDropdownEnabled');
    this.isEnabled = stored !== null ? stored === 'true' : true;
  }

  onToggleChange(): void {
    // Guardar el estado en localStorage
    localStorage.setItem('empresaDropdownEnabled', this.isEnabled.toString());
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
