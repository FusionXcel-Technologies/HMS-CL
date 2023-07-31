import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputURLComponent } from './input-url.component';

describe('InputURLComponent', () => {
  let component: InputURLComponent;
  let fixture: ComponentFixture<InputURLComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputURLComponent]
    });
    fixture = TestBed.createComponent(InputURLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
