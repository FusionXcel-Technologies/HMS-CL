import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryManagementCategoriesComponent } from './inventory-management-categories.component';

describe('InventoryManagementCategoriesComponent', () => {
  let component: InventoryManagementCategoriesComponent;
  let fixture: ComponentFixture<InventoryManagementCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryManagementCategoriesComponent]
    });
    fixture = TestBed.createComponent(InventoryManagementCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
