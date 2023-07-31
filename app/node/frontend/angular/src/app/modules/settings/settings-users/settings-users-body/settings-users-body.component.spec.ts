import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsUsersBodyComponent } from './settings-users-body.component';

describe('SettingsUsersBodyComponent', () => {
  let component: SettingsUsersBodyComponent;
  let fixture: ComponentFixture<SettingsUsersBodyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsUsersBodyComponent]
    });
    fixture = TestBed.createComponent(SettingsUsersBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
