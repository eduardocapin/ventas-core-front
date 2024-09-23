import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteMasInfoComponent } from './cliente-mas-info.component';

describe('ClienteMasInfoComponent', () => {
  let component: ClienteMasInfoComponent;
  let fixture: ComponentFixture<ClienteMasInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClienteMasInfoComponent]
    });
    fixture = TestBed.createComponent(ClienteMasInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
