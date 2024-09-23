import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtiquetaValorComponent } from './etiqueta-valor.component';

describe('EtiquetaValorComponent', () => {
  let component: EtiquetaValorComponent;
  let fixture: ComponentFixture<EtiquetaValorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EtiquetaValorComponent]
    });
    fixture = TestBed.createComponent(EtiquetaValorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
