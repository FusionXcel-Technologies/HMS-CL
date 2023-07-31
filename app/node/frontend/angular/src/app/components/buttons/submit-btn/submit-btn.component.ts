import { Component, Input } from '@angular/core';

@Component({
  selector: 'component-button-submit_btn',
  templateUrl: './submit-btn.component.html',
  styleUrls: ['./submit-btn.component.scss']
})
export class SubmitBtnComponent {

  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() type: string = 'button';
}
