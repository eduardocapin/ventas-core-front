import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnIconExpandComponent } from './btn-icon-expand.component';

describe('BtnIconExpandComponent', () => {
  let component: BtnIconExpandComponent;
  let fixture: ComponentFixture<BtnIconExpandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BtnIconExpandComponent]
    });
    fixture = TestBed.createComponent(BtnIconExpandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
