import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncComponent } from './sync.component';

describe('SyncComponent', () => {
  let component: SyncComponent;
  let fixture: ComponentFixture<SyncComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SyncComponent]
    });
    fixture = TestBed.createComponent(SyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
