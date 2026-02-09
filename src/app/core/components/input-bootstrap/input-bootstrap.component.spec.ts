import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputBootstrapComponent } from './input-bootstrap.component';

describe('InputBootstrapComponent', () => {
  let component: InputBootstrapComponent;
  let fixture: ComponentFixture<InputBootstrapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputBootstrapComponent]
    });
    fixture = TestBed.createComponent(InputBootstrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
