import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryManagementItemsComponent } from './inventory-management-items.component';

describe('InventoryManagementItemsComponent', () => {
  let component: InventoryManagementItemsComponent;
  let fixture: ComponentFixture<InventoryManagementItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryManagementItemsComponent]
    });
    fixture = TestBed.createComponent(InventoryManagementItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
