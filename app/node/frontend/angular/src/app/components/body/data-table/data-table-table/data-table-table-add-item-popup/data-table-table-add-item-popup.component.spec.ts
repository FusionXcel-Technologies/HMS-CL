import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableTableAddItemPopupComponent } from './data-table-table-add-item-popup.component';

describe('DataTableTableAddItemPopupComponent', () => {
  let component: DataTableTableAddItemPopupComponent;
  let fixture: ComponentFixture<DataTableTableAddItemPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataTableTableAddItemPopupComponent]
    });
    fixture = TestBed.createComponent(DataTableTableAddItemPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
