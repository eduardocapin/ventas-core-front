import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditReasonRejectionsComponent } from './add-edit-reason-rejections.component';

describe('AddEditReasonRejectionsComponent', () => {
  let component: AddEditReasonRejectionsComponent;
  let fixture: ComponentFixture<AddEditReasonRejectionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditReasonRejectionsComponent]
    });
    fixture = TestBed.createComponent(AddEditReasonRejectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
