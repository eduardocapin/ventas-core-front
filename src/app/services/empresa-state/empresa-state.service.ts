import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaStateService {
  private selectedEmpresaSubject = new BehaviorSubject<string>('all');
  public selectedEmpresa$ = this.selectedEmpresaSubject.asObservable();

  setSelectedEmpresa(empresa: string) {
    this.selectedEmpresaSubject.next(empresa);
  }

  getSelectedEmpresa(): string {
    return this.selectedEmpresaSubject.value;
  }
}