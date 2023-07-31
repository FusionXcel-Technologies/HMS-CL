import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableExportComponent } from './data-table-export.component';

describe('DataTableExportComponent', () => {
  let component: DataTableExportComponent;
  let fixture: ComponentFixture<DataTableExportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataTableExportComponent]
    });
    fixture = TestBed.createComponent(DataTableExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
