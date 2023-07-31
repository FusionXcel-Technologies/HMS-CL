import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSelectSingleComponent } from './input-select-single.component';

describe('InputSelectSingleComponent', () => {
  let component: InputSelectSingleComponent;
  let fixture: ComponentFixture<InputSelectSingleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputSelectSingleComponent]
    });
    fixture = TestBed.createComponent(InputSelectSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
