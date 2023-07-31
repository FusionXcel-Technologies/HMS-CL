import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableTableDeleteItemPopupComponent } from './data-table-table-delete-item-popup.component';

describe('DataTableTableDeleteItemPopupComponent', () => {
  let component: DataTableTableDeleteItemPopupComponent;
  let fixture: ComponentFixture<DataTableTableDeleteItemPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataTableTableDeleteItemPopupComponent]
    });
    fixture = TestBed.createComponent(DataTableTableDeleteItemPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
