import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteDireccionesComponent } from './cliente-direcciones.component';

describe('ClienteDireccionesComponent', () => {
  let component: ClienteDireccionesComponent;
  let fixture: ComponentFixture<ClienteDireccionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClienteDireccionesComponent]
    });
    fixture = TestBed.createComponent(ClienteDireccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
