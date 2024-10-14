import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtiquetaValorVerticalComponent } from './etiqueta-valor-vertical.component';

describe('EtiquetaValorVerticalComponent', () => {
  let component: EtiquetaValorVerticalComponent;
  let fixture: ComponentFixture<EtiquetaValorVerticalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EtiquetaValorVerticalComponent]
    });
    fixture = TestBed.createComponent(EtiquetaValorVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
