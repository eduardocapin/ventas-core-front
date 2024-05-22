import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupClientDetailComponent } from './popup-client-detail.component';

describe('PopupClientDetailComponent', () => {
  let component: PopupClientDetailComponent;
  let fixture: ComponentFixture<PopupClientDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupClientDetailComponent]
    });
    fixture = TestBed.createComponent(PopupClientDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
