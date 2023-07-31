import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'component-text-input-box',
  templateUrl: './text-input-box.component.html',
  styleUrls: ['./text-input-box.component.scss']
})
export class TextInputBoxComponent {
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() width: string = '500';
  @Input() value: string = '';
  @Input() message: string | any = '';
  @Input() messageType: string = 'default';
  @Input() class: string = 'input-container';
  @Output() valueChange = new EventEmitter<string>();
  @Output() disableEnableChange = new EventEmitter<any>();
  // input_type = 'text';
  @Input() has_error = false;
  mouseIn = 'not_enterd';

  constructor() { }

  ngOnInit(): void {
    this.class = (!this.value) ? this.class.replace(' input-container-touched', '') : this.class;
  };

  onValueChange(value: string) {
    this.class = this.class.replace(' input-container-touched', '') + ' input-container-touched';
    this.value = value;
    this.class = (!this.value) ? this.class.replace(' input-container-touched', '') : this.class;
    this.valueChange.emit(this.value);
    this.mouseIn = 'mouse_in';
    this.messageType = 'default';
    this.message = ''
    this.onKeyUp()
  };

  changeErrorVal(val: boolean) {
    this.has_error = val;
    this.disableEnableChange.emit({ id: this.id, has_error: this.has_error })
  }

  onMouseLeave() {
    this.mouseIn = this.mouseIn == 'mouse_in' ? 'mouse_leave' : this.mouseIn;
    //console.log('mouse leave: ', this.mouseIn);

    this.onKeyUp()
  }

  onKeyUp() {
    this.class = (!this.value) ? this.class.replace(' input-container-touched', '') : this.class;
    if (this.value) {
      let value = this.value.replace(/\s/g, '');
      this.messageType = '';
      this.message = ''
      this.changeErrorVal(false);
      //console.log(value);
      for (let index = 0; index < value.length; index++) {
        const char = value[index];
        if (char && (char != ' ')) {
          if (this.type == 'tel') {
            let condition_one = (isNaN(parseInt(char)) && char != '+') || (!(value[0] == '+' || value[0] == '0'));
            let condition_two = (this.mouseIn == 'mouse_leave') && (value.length < 10);
            condition_two = value.length > 14 ? true : condition_two;
            if (condition_one || condition_two) {

              if (condition_one) {
                this.messageType = 'error';
                this.message = `Invalid Contact Number`;
                this.value = '';
                this.changeErrorVal(true);
              }

              if (condition_two) {
                this.messageType = 'error';
                this.message = `Invalid Contact Number`;
                this.value = '';
                this.changeErrorVal(true);
              }
              break;
            }
          } else {
            break;
          }
        }
      }
    } else {
      this.changeErrorVal(true);
    }
  }
}
