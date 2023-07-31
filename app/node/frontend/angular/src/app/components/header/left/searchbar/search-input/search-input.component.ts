import { Component } from '@angular/core';

@Component({
  selector: 'component-header-left-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent {
  clearTextButtonClass: string = 'hide';
  value: string = '';

  clearTextActive() {
    this.clearTextButtonClass = this.value == '' ? 'hide' : '';
  }
  clearText() {
    this.value = '';
    this.clearTextButtonClass = 'hide';
  }
}
