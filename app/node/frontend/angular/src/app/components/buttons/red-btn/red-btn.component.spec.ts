import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedBtnComponent } from './red-btn.component';

describe('RedBtnComponent', () => {
  let component: RedBtnComponent;
  let fixture: ComponentFixture<RedBtnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RedBtnComponent]
    });
    fixture = TestBed.createComponent(RedBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
