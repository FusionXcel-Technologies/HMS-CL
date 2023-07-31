import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModulesService } from 'src/app/modules.service';

@Component({
  selector: 'app-data-table-table-delete-item-popup',
  templateUrl: './data-table-table-delete-item-popup.component.html',
  styleUrls: ['./data-table-table-delete-item-popup.component.scss']
})
export class DataTableTableDeleteItemPopupComponent {
  @Input() itemId: any;
  @Input() cssClass: string = '';
  @Input() url: any;
  @Output() refreshTable = new EventEmitter<any>();


  constructor(private modulesService: ModulesService) { };

  deleteItemModelClose() {
    this.cssClass = '';
  }

  deleteItem() {
    console.log(this.itemId);

    this.modulesService.sendRequestToServer<any>(`/${this.url}/delete/${this.itemId}`, 'delete').subscribe(
      (response: any) => {
        console.log(response);
        this.refreshTable.emit();
        this.deleteItemModelClose();
      },
      (error: any) => {
        console.error(error);
        // Handle error properly and provide feedback to the user
      }
    );
  }
}
