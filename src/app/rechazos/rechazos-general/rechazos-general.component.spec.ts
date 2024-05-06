import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechazosGeneralComponent } from './rechazos-general.component';

describe('RechazosGeneralComponent', () => {
  let component: RechazosGeneralComponent;
  let fixture: ComponentFixture<RechazosGeneralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RechazosGeneralComponent]
    });
    fixture = TestBed.createComponent(RechazosGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
