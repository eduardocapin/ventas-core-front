import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteEconomicosComponent } from './cliente-economicos.component';

describe('ClienteEconomicosComponent', () => {
  let component: ClienteEconomicosComponent;
  let fixture: ComponentFixture<ClienteEconomicosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClienteEconomicosComponent]
    });
    fixture = TestBed.createComponent(ClienteEconomicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
