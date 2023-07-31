import { Component } from '@angular/core';
import { ModulesService } from 'src/app/modules.service';

@Component({
  selector: 'app-settings-users-body',
  templateUrl: './settings-users-body.component.html',
  styleUrls: ['./settings-users-body.component.scss']
})
export class SettingsUsersBodyComponent {
  table_data: any = [];
  table_head: any = {};
  table_name: string = '';
  add_item_clases: string = ''; // CSS class for adding/removing a table item

  constructor(private modulesService: ModulesService) {
    // this.modulesService.sendRequestToServer<any>('/auth/getUsersList', 'get').subscribe(
    //   (response: any) => {

    //     this.table_data = response;
    //     this.table_name = "User";

    //     let table_data_length = this.table_data.length;

    //     function isObjectEmpty(obj: object): boolean {
    //       for (const key in obj) {
    //         if (obj.hasOwnProperty(key)) {
    //           return false;
    //         }
    //       }
    //       return true;
    //     }

    //     for (let index = 0; index < table_data_length; index++) {
    //       const body_item = this.table_data[index];
    //       let table_head = Object.keys(body_item);
    //       // console.log('table head: ', Object.keys(body_item));

    //       if (isObjectEmpty(this.table_head)) {

    //         for (let i = 0; i < table_head.length; i++) {
    //           const cell = table_head[i];
    //           this.table_head[cell] = { name: cell, width: cell.length };


    //         }
    //       } else {
    //         for (let i = 0; i < table_head.length; i++) {
    //           const cell = table_head[i];
    //           if (body_item[cell]) {

    //             this.table_head[cell].width = (this.table_head[cell].width < body_item[cell].length) && (body_item[cell].length < 50) ? body_item[cell].length : this.table_head[cell].width;

    //           }
    //         }
    //       }
    //       // for (let i = 0; i < table_head.length; i++) {
    //       //   const cell = table_head[i];
    //       //   console.log(cell, i);

    //       //   this.table_head[cell] = { name: cell, width: cell.length };
    //       //   console.log(this.table_head);
    //       // }
    //       //   console.log(this.table_head);

    //     }

    //   },
    //   (error: any) => {

    //     console.error(error);


    //   })
  }

  addItemModel() {
    console.log('val: ');
    this.add_item_clases = this.add_item_clases == '' ? 'active' : '';
    // Toggles the 'active' CSS class for adding/removing a table item
  }

  // getTypeVal(val: any) {

  // }
}
