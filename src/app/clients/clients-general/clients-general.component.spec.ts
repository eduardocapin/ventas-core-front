import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsGeneralComponent } from './clients-general.component';

describe('ClientsGeneralComponent', () => {
  let component: ClientsGeneralComponent;
  let fixture: ComponentFixture<ClientsGeneralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientsGeneralComponent]
    });
    fixture = TestBed.createComponent(ClientsGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
