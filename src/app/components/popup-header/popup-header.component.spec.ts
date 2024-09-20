import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupHeaderComponent } from './popup-header.component';

describe('PopupHeaderComponent', () => {
  let component: PopupHeaderComponent;
  let fixture: ComponentFixture<PopupHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupHeaderComponent]
    });
    fixture = TestBed.createComponent(PopupHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
