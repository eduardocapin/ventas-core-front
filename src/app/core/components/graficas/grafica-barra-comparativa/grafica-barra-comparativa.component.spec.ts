import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficaBarraComparativaComponent } from './grafica-barra-comparativa.component';

describe('GraficaBarraComparativaComponent', () => {
  let component: GraficaBarraComparativaComponent;
  let fixture: ComponentFixture<GraficaBarraComparativaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraficaBarraComparativaComponent]
    });
    fixture = TestBed.createComponent(GraficaBarraComparativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
