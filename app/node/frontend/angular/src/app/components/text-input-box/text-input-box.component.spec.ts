import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInputBoxComponent } from './text-input-box.component';

describe('TextInputBoxComponent', () => {
  let component: TextInputBoxComponent;
  let fixture: ComponentFixture<TextInputBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextInputBoxComponent]
    });
    fixture = TestBed.createComponent(TextInputBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
