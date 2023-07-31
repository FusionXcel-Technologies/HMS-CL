import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputRangeComponent } from './input-range.component';

describe('InputRangeComponent', () => {
  let component: InputRangeComponent;
  let fixture: ComponentFixture<InputRangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputRangeComponent]
    });
    fixture = TestBed.createComponent(InputRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
