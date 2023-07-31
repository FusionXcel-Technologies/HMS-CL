import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSuggestionComponent } from './search-suggestion.component';

describe('SearchSuggestionComponent', () => {
  let component: SearchSuggestionComponent;
  let fixture: ComponentFixture<SearchSuggestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchSuggestionComponent]
    });
    fixture = TestBed.createComponent(SearchSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
