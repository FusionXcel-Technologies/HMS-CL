import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModulesService } from 'src/app/modules.service';

@Component({
  selector: 'app-data-table-table',
  templateUrl: './data-table-table.component.html',
  styleUrls: ['./data-table-table.component.scss']
})
export class DataTableTableComponent implements OnInit {
  @ViewChild('tableData', { static: false }) tableDataRef!: ElementRef;


  @Input() table: any;
  @Input() url: string = '';
  @Output() refreshTableMain = new EventEmitter<any>();
  header_Keys: any = [];
  add_item_clases: string = '';
  update_item_id: any;
  update_item_clases: string = '';
  delete_item_id: any;
  delete_item_clases: string = '';
  view_item_id: any;
  view_item: any;
  view_item_clases: string = '';
  count: number = 0;
  table_data_find_text: string = '';
  table_data: any = {};
  table_search_arr: any = [];
  table_touched: boolean = false;
  table_display_data: any;

  constructor(private modulesService: ModulesService) { }
  refreshTableFunc() {
    this.table_touched = false;
    this.refreshTableMain.emit()
  }

  ngOnInit(): void {
    // this.table_data = this.table;
  }

  findInTable() {
    this.table_touched = true;
    if (!this.table.data || this.table_data_find_text.trim().length === 0) {
      // If the search text is empty or there is no data, reset the table_data array to show all items
      this.table_display_data = this.table.data;
      return;
    }

    const term = this.table_data_find_text.toLowerCase().trim();
    const searchResults = this.filterItems(this.table.data, term);
    this.table_display_data = searchResults;
  }
  tableHeight: any;
  onScroll() {
    // console.log('onscr');

    // const tableElement = this.tableDataRef.nativeElement;
    // this.tableHeight = tableElement.getBoundingClientRect().height;
    // const scrollPosition = tableElement.scrollTop;
    // const scrollThreshold = 0.9; // 90% scroll threshold

    // if (scrollPosition >= scrollThreshold * this.tableHeight) {

    //   this.tableHeight += scrollPosition;
    //   console.log('tble height: ', this.tableHeight);
    //   this.refreshTableFunc()
    // }
  }


  private filterItems(items: any[], term: string): any[] {
    return items.filter((item: any) => this.isItemMatchingSearchTerm(item, term));
  }

  private isItemMatchingSearchTerm(item: any, term: string): boolean {
    for (let key in item) {
      const value = item[key];

      if (typeof value === 'string' && value.toLowerCase().includes(term)) {
        return true;
      } else if (typeof value === 'object') {
        // If the property is an object, recursively search nested properties
        if (this.isItemMatchingSearchTerm(value, term)) {
          return true;
        }
      }
    }

    return false;
  }



  objectKeys(obj: any): any {
    if (this.header_Keys.length != 0) {
      return this.header_Keys; // If head_keys is already populated, return it
    } else {
      let obj_arr = Object.values(obj);
      for (let index = 0; index < obj_arr.length; index++) {
        const element = obj_arr[index];
        this.header_Keys.push(element); // Adds each value of the object to the head_keys array
      }
      return this.header_Keys; // Returns the head_keys array
    }
  }

  addItemModelActive() {
    this.count = this.count + 1;
    this.add_item_clases = this.count + ' active';
  }
  updateItemModelActive(item_id: any) {

    this.count = this.count + 1;
    this.update_item_id = item_id;
    // console.log('update utem id: ', this.update_item_id);

    this.update_item_clases = this.count + ' active';
  };



  async viewItemModelActive(item_id: any) {
    try {
      const response: any = await this.modulesService.sendRequestToServer<any>(
        `/${this.url}/view/${item_id}`,
        'get'
      ).toPromise();
      //console.log(response);

      const item_data = response;
      const values_sqrt = Math.floor(Math.sqrt(Object.keys(item_data).length));
      let item_data_keys = Object.keys(item_data);
      let item_data_values = Object.values(item_data);
      let item_data_arr = []
      for (let index = 0; index < item_data_keys.length; index++) {
        const key = item_data_keys[index];
        item_data_arr.push({ key: key, value: item_data_values[index] });
      }
      // console.log(item_data_arr);

      this.view_item = [];
      // console.log(item_data);

      while (item_data_arr.length > 0) {
        //  console.log(item_data_arr);

        this.view_item.push(item_data_arr.splice(0, values_sqrt));
      }

      this.count++;
      this.view_item_id = item_id;
      this.view_item_clases = this.count + ' active';
      //console.log('view item A:', this.view_item);

    } catch (error: any) {
      console.error(error);
      // Handle error properly and provide feedback to the user
    }
  };

  deleteItemModelActive(item_id: any) {

    this.count = this.count + 1;
    this.delete_item_id = item_id;
    // console.log('update utem id: ', this.update_item_id);

    this.delete_item_clases = this.count + ' active';
  }

}
