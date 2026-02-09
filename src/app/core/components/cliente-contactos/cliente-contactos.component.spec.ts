import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteContactosComponent } from './cliente-contactos.component';

describe('ClienteContactosComponent', () => {
  let component: ClienteContactosComponent;
  let fixture: ComponentFixture<ClienteContactosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClienteContactosComponent]
    });
    fixture = TestBed.createComponent(ClienteContactosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
