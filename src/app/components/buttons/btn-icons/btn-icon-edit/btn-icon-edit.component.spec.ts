import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnIconEditComponent } from './btn-icon-edit.component';

describe('BtnIconEditComponent', () => {
  let component: BtnIconEditComponent;
  let fixture: ComponentFixture<BtnIconEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BtnIconEditComponent]
    });
    fixture = TestBed.createComponent(BtnIconEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
