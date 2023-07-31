import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputImagesComponent } from './input-images.component';

describe('InputImagesComponent', () => {
  let component: InputImagesComponent;
  let fixture: ComponentFixture<InputImagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputImagesComponent]
    });
    fixture = TestBed.createComponent(InputImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
