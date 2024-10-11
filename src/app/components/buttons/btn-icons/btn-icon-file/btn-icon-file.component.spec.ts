import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnIconFileComponent } from './btn-icon-file.component';

describe('BtnIconFileComponent', () => {
  let component: BtnIconFileComponent;
  let fixture: ComponentFixture<BtnIconFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BtnIconFileComponent]
    });
    fixture = TestBed.createComponent(BtnIconFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
