import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnExportComponent } from './btn-export.component';

describe('BtnExportComponent', () => {
  let component: BtnExportComponent;
  let fixture: ComponentFixture<BtnExportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BtnExportComponent]
    });
    fixture = TestBed.createComponent(BtnExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
