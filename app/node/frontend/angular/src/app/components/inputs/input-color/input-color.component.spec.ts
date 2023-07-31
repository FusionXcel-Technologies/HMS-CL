import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputColorComponent } from './input-color.component';

describe('InputColorComponent', () => {
  let component: InputColorComponent;
  let fixture: ComponentFixture<InputColorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputColorComponent]
    });
    fixture = TestBed.createComponent(InputColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
