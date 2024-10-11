import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnIconDeleteComponent } from './btn-icon-delete.component';

describe('BtnIconDeleteComponent', () => {
  let component: BtnIconDeleteComponent;
  let fixture: ComponentFixture<BtnIconDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BtnIconDeleteComponent]
    });
    fixture = TestBed.createComponent(BtnIconDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
