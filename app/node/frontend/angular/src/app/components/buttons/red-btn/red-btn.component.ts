import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-red-btn',
  templateUrl: './red-btn.component.html',
  styleUrls: ['./red-btn.component.scss']
})
export class RedBtnComponent {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() type: string = 'button';
}
