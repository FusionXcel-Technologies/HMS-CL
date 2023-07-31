import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableFindComponent } from './data-table-find.component';

describe('DataTableFindComponent', () => {
  let component: DataTableFindComponent;
  let fixture: ComponentFixture<DataTableFindComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataTableFindComponent]
    });
    fixture = TestBed.createComponent(DataTableFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
