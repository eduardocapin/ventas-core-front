import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEditPopupComponent } from './profile-edit-popup.component';

describe('ProfileEditPopupComponent', () => {
  let component: ProfileEditPopupComponent;
  let fixture: ComponentFixture<ProfileEditPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileEditPopupComponent]
    });
    fixture = TestBed.createComponent(ProfileEditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
