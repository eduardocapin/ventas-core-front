import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonsRejectionsComponent } from './reasons-rejections.component';

describe('ReasonsRejectionsComponent', () => {
  let component: ReasonsRejectionsComponent;
  let fixture: ComponentFixture<ReasonsRejectionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReasonsRejectionsComponent]
    });
    fixture = TestBed.createComponent(ReasonsRejectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
