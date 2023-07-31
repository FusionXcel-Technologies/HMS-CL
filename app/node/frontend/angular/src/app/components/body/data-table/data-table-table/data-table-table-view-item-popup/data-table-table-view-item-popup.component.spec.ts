import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableTableViewItemPopupComponent } from './data-table-table-view-item-popup.component';

describe('DataTableTableViewItemPopupComponent', () => {
  let component: DataTableTableViewItemPopupComponent;
  let fixture: ComponentFixture<DataTableTableViewItemPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataTableTableViewItemPopupComponent]
    });
    fixture = TestBed.createComponent(DataTableTableViewItemPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
