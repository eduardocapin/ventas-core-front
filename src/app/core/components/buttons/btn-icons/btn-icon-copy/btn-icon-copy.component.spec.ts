import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnIconCopyComponent } from './btn-icon-copy.component';

describe('BtnIconCopyComponent', () => {
  let component: BtnIconCopyComponent;
  let fixture: ComponentFixture<BtnIconCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtnIconCopyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnIconCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

