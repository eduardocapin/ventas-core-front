import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteDatosGeneralesComponent } from './cliente-datos-generales.component';

describe('ClienteDatosGeneralesComponent', () => {
  let component: ClienteDatosGeneralesComponent;
  let fixture: ComponentFixture<ClienteDatosGeneralesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClienteDatosGeneralesComponent]
    });
    fixture = TestBed.createComponent(ClienteDatosGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
