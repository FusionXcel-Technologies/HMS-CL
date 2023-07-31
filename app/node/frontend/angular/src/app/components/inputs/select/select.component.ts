import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DisplayValue, Trie } from './trie'; // Import Trie and DisplayValue from their separate files

enum MessageType {
  Default = 'default',
  Success = 'success',
  Error = 'error',
}

@Component({
  selector: 'app-input-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {
  @Input() label = '';
  @Input() id = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() width = '500';
  @Input() value = '';
  @Input() select_multiple = true;
  @Input() values_list: DisplayValue[] = [];
  @Input() message: string | any = '';
  @Input() messageType: MessageType = MessageType.Default;
  @Input() class = 'input-container';

  @Output() valueChange = new EventEmitter<any>();
  @Output() disableEnableChange = new EventEmitter<any>();
  display_values_list: DisplayValue[] = [];
  select_list_view = false;

  display_value: any = [];
  has_error = false;
  mouseIn: 'not_entered' | 'mouse_in' | 'mouse_leave' = 'not_entered';
  displayValuesObj: any = {};
  searchArr: any = [];

  private trie: Trie = new Trie();

  constructor() { }

  ngOnInit(): void {
    this.onMouseEnter(false);
    this.display_values_list = this.values_list.map((value, index) => ({
      id: index,
      name: value.name,
      value: value.value || value.id.toString(),
      selected: false,
    }));
    this.changeDisplayValuesObj(this.display_values_list);
    this.buildTrie(this.display_values_list);
  }

  viewSelect() {
    this.select_list_view = true;
  }

  changeDisplayValuesObj(displayArr: DisplayValue[]) {
    for (const value of displayArr) {
      this.displayValuesObj[value.id] = { id: value.id, name: value.name, value: value.value };
      this.displayValuesObj[value.name] = { id: value.id, name: value.name, value: value.value };
      this.displayValuesObj[value.value] = { id: value.id, name: value.name, value: value.value };
      this.searchArr.push(value.name);
      this.searchArr.push(value.value);
    }
  }

  buildTrie(displayValues: DisplayValue[]) {
    for (const value of displayValues) {
      const words = [value.name, value.value];
      for (const word of words) {
        this.trie.addToTrie(word.toString(), value);
      }
    }
  }

  searchValue(searchQuery: string) {
    this.display_values_list = this.trie.searchValue(searchQuery);
  }

  selectValue(id: number) {
    const selectedValue = this.display_values_list.find((val) => val.id === id);

    if (!selectedValue) {
      console.error(`Value not found with ID: ${id}`);
      return;
    }

    const { value, name } = selectedValue;

    this.value = this.value || '';
    this.value = this.value.toString();

    const isValueIncluded = this.value.includes(value);

    if (isValueIncluded) {
      this.display_values_list = this.display_values_list.map((val) =>
        val.id === id ? { ...val, selected: false } : val
      );

      this.display_value = this.display_value.filter((item: any) => item !== name);

      this.value = this.value?.replace(new RegExp(`\\s*,?${value}`, 'g'), '');
    } else {
      this.display_values_list = this.display_values_list.map((val) =>
        val.id === id ? { ...val, selected: true } : val
      );

      if (this.select_multiple) {
        this.value += this.value.length === 0 ? value : `,${value}`;
        this.display_value.push(name);
      } else {
        this.value = value;
        this.display_value = [name];

        this.display_values_list = this.display_values_list.map((val) =>
          val.id !== id ? { ...val, selected: false } : val
        );
      }
    }
    let val_change = this.value;
    this.valueChange.emit(val_change);
  }

  removeSelectedItem(val: string) {
    const selectedValueIndex = this.display_values_list.findIndex((value) => value.name === val);

    if (selectedValueIndex === -1) {
      console.error(`Value not found with name: ${val}`);
      return;
    }

    const selectedValue = this.display_values_list[selectedValueIndex];
    selectedValue.selected = false;
    this.display_value.splice(this.display_value.indexOf(val), 1);

    const valueToRemove = selectedValue.value;

    if (this.select_multiple) {
      this.value = this.value.replace(new RegExp(`\\s*,?${valueToRemove}`, 'g'), '');
    } else {
      this.value = '';
    }
  }

  onValueChange(value: string) {
    //this.class = this.class.replace(' input-container-touched', '') + ' input-container-touched';
    this.searchValue(value);
    this.select_list_view = this.display_values_list.length !== 0;
    // this.class = !this.value ? this.class.replace(' input-container-touched', '') : this.class;

    this.mouseIn = 'mouse_in';
    //this.messageType = MessageType.Default;
    // this.message = '';
    this.onKeyUp();
  }

  changeErrorVal(val: boolean) {
    this.has_error = val;
    this.disableEnableChange.emit({ id: this.id, has_error: this.has_error });
  }

  onMouseEnter(l: boolean) {
    if (!this.value) {
      this.display_value = [];
      this.select_list_view = false;
    } else {
      this.select_list_view = l;
    }
  }

  onMouseLeave(l: boolean) {
    this.mouseIn = this.mouseIn === 'mouse_in' ? 'mouse_leave' : this.mouseIn;
    this.onKeyUp();
  }

  onKeyUp() {
    // this.class = !this.value ? this.class.replace(' input-container-touched', '') : this.class;
    if (this.value) {
      this.messageType = MessageType.Default;
      this.message = '';
      this.changeErrorVal(false);
    } else {
      this.changeErrorVal(true);
    }
  }
}
