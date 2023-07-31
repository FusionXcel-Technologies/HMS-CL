import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ModulesService } from 'src/app/modules.service';

@Component({
  selector: 'app-data-table-table-add-item-popup',
  templateUrl: './data-table-table-add-item-popup.component.html',
  styleUrls: ['./data-table-table-add-item-popup.component.scss']
})
export class DataTableTableAddItemPopupComponent implements OnInit {

  @Input() cssClass: string = '';
  @Input() url: any;
  inputs: any;
  form_data: any = {};
  @Output() refreshTable = new EventEmitter<any>();
  messages: any = {};
  completedMessage: any;
  inputs_length: any;

  constructor(private modulesService: ModulesService) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cssClass']) {
      this.getInputData();
    }
  }

  getFormattedPlaceholder(placeholder: string, key: string): string {
    if (!placeholder) {
      return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    } else {
      return placeholder;
    }
  }

  selectValueChange(value: any) {

    this.form_data[value.key] = value.value;
    console.log('select val change: ', this.form_data);
  }
  addItemModelClose() {
    this.cssClass = '';
    this.messages = {};
    this.form_data = {};
  }

  AddItem() {

    this.messages = { common: [{ message_type: 'error', message: "Internal Server Error" }] };
    this.completedMessage = 'sd';
    console.log('form data: ', this.form_data);

    this.modulesService.sendRequestToServer<any>(`/${this.url}/create`, 'post', this.form_data).subscribe(
      (response: any) => {
        console.log(response);
        this.messages = { common: { message_type: 'completed', message: 'Completed' } }
        this.form_data = {};
        this.refreshTable.emit()
        this.getInputData();
      },
      (error: any) => {
        console.error('err: ', error);
        this.messages = error.error;
        console.log('messages: ', this.messages);
        // Handle error properly and provide feedback to the user
      }
    );
  }


  getInputData() {
    this.modulesService.sendRequestToServer<any>(`/${this.url}/create`, 'post').subscribe(
      (response: any) => {
        const { input_data } = response;
        this.inputs = input_data;
        let inputs_sqrt = Math.floor(Math.sqrt(Object.keys(input_data).length));
        inputs_sqrt = inputs_sqrt > 3 ? 2 : inputs_sqrt;
        this.inputs_length = [];

        while (input_data.length > 0) {
          this.inputs_length.push(input_data.splice(0, inputs_sqrt));
        }
        // console.log(this.inputs_length);

      },
      (error: any) => {
        console.error(error);
        // Handle error properly and provide feedback to the user
      }
    );
  }


  ngOnInit(): void {
    this.getInputData();
  }
}
