import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ModulesService } from 'src/app/modules.service';


@Component({
  selector: 'app-data-table-table-update-item-popup',
  templateUrl: './data-table-table-update-item-popup.component.html',
  styleUrls: ['./data-table-table-update-item-popup.component.scss']
})
export class DataTableTableUpdateItemPopupComponent {
  @Input() cssClass: string = '';
  @Input() url: any;
  @Input() itemId: any;

  inputs: any;
  form_data: any = {};
  @Output() refreshTable = new EventEmitter<any>();
  messages: any = {};
  completedMessage: any;
  inputs_length: any;

  constructor(private modulesService: ModulesService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['itemId']) {
      this.getInputData();
    }
  }

  updateItemModelClose() {
    this.cssClass = '';
    this.messages = {};
    this.form_data = {};
  }

  updateItem() {
    this.messages = { common: { message_type: 'error', message: "Internal Server Error" } };
    this.completedMessage = 'sd';
    this.form_data.item_id = this.itemId;
    this.modulesService.sendRequestToServer<any>(`/${this.url}/update/${this.itemId}`, 'put', this.form_data).subscribe(
      (response: any) => {
        console.log(response);
        this.messages = { common: { message_type: 'completed', message: 'Completed' } }
        this.form_data = {};
        this.refreshTable.emit()
      },
      (error: any) => {
        console.error(error);
        this.messages = error.error;
        console.log('messages: ', this.messages);
        // Handle error properly and provide feedback to the user
      }
    );
  }

  getInputData() {
    this.modulesService.sendRequestToServer<any>(`/${this.url}/update/${this.itemId}`, 'put').subscribe(
      (response: any) => {
        const { input_data } = response;
        this.inputs = input_data;
        const inputs_sqrt = Math.floor(Math.sqrt(Object.keys(input_data).length));
        this.inputs_length = [];

        while (input_data.length > 0) {
          this.inputs_length.push(input_data.splice(0, inputs_sqrt));
        }
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
