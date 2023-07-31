import { Component, Input, OnInit } from '@angular/core';
import { ModulesService } from 'src/app/modules.service';


@Component({
  selector: 'app-data-table-table-view-item-popup',
  templateUrl: './data-table-table-view-item-popup.component.html',
  styleUrls: ['./data-table-table-view-item-popup.component.scss']
})
export class DataTableTableViewItemPopupComponent {
  @Input() cssClass: string = '';
  @Input() url: any;
  @Input() itemId: any;

  @Input() item: any;

  constructor(private modulesService: ModulesService) { }

  viewItemModelClose() {
    this.cssClass = '';
  }



  getItem() {

    this.modulesService.sendRequestToServer<any>(`/${this.url}/view/${this.itemId}`, 'get').subscribe(
      (response: any) => {
        const { item_data } = response;
        const values_sqrt = Math.floor(Math.sqrt(Object.keys(item_data).length));
        this.item = [];

        while (item_data.length > 0) {
          this.item.push(item_data.splice(0, values_sqrt));
        }
        console.log(this.item);

      },
      (error: any) => {
        console.error(error);
        // Handle error properly and provide feedback to the user
      }
    );
  }

  ngOnInit(): void {
    //   console.log('itemId view comp: ', this.item);
  }
}
