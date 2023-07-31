import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableTableUpdateItemPopupComponent } from './data-table-table-update-item-popup.component';

describe('DataTableTableUpdateItemPopupComponent', () => {
  let component: DataTableTableUpdateItemPopupComponent;
  let fixture: ComponentFixture<DataTableTableUpdateItemPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataTableTableUpdateItemPopupComponent]
    });
    fixture = TestBed.createComponent(DataTableTableUpdateItemPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
