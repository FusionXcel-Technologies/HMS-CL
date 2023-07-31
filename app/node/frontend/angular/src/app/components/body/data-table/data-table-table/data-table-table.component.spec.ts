import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableTableComponent } from './data-table-table.component';

describe('DataTableTableComponent', () => {
  let component: DataTableTableComponent;
  let fixture: ComponentFixture<DataTableTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataTableTableComponent]
    });
    fixture = TestBed.createComponent(DataTableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
