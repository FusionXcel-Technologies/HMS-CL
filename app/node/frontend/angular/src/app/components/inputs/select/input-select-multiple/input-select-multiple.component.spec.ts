import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSelectMultipleComponent } from './input-select-multiple.component';

describe('InputSelectMultipleComponent', () => {
  let component: InputSelectMultipleComponent;
  let fixture: ComponentFixture<InputSelectMultipleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputSelectMultipleComponent]
    });
    fixture = TestBed.createComponent(InputSelectMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
