import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputEmailComponent } from './input-email.component';

describe('InputEmailComponent', () => {
  let component: InputEmailComponent;
  let fixture: ComponentFixture<InputEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputEmailComponent]
    });
    fixture = TestBed.createComponent(InputEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
