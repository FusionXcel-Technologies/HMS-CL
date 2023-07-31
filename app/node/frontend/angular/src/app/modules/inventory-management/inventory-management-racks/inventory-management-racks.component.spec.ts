import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryManagementRacksComponent } from './inventory-management-racks.component';

describe('InventoryManagementRacksComponent', () => {
  let component: InventoryManagementRacksComponent;
  let fixture: ComponentFixture<InventoryManagementRacksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryManagementRacksComponent]
    });
    fixture = TestBed.createComponent(InventoryManagementRacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
