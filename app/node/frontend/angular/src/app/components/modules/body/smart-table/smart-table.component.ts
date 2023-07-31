import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-smartTable',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss']
})
export class SmartTableComponent {
  @Input() body: any[] = []; // Input property for table body data
  @Input() head: any[] = []; // Input property for table header data
  @Input() name: string = '';
  @Output() addItemPopUp: EventEmitter<any> = new EventEmitter();

  head_keys: any = []; // Array to store the keys of the table header

  constructor() {
  }



  formatHeader(header: string): string {
    return header.replace(/_/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase());
    // Formats the header string by replacing underscores with spaces and capitalizing the first letter of each word
  }

  formatCellWidth(width: any) {
    width = parseInt(width); // Converts width to an integer

    width = width > 20 ? 20 : width; // Limits the width to a maximum of 20
    width = width < 3 ? 3 : width; // Limits the width to a minimum of 3
    width = width / 8;
    width = width * 12;

    return width + 'rem'; // Returns the formatted width with 'rem' unit
  }

  objectKeys(obj: any): any {
    if (this.head_keys.length != 0) {
      return this.head_keys; // If head_keys is already populated, return it
    } else {
      let obj_arr = Object.values(obj);
      for (let index = 0; index < obj_arr.length; index++) {
        const element = obj_arr[index];
        this.head_keys.push(element); // Adds each value of the object to the head_keys array
      }
      return this.head_keys; // Returns the head_keys array
    }
  }

  addItemModel() {
    this.addItemPopUp.emit()
    // Toggles the 'active' CSS class for adding/removing a table item
  }

  getDateTimeStamp = () => {
    // Returns a formatted date and time string
    const currentDate = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const day = currentDate.getDate();
    const month = monthsOfYear[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    const hour = currentDate.getHours();
    const minute = currentDate.getMinutes();
    const second = currentDate.getSeconds();
    const millisecond = currentDate.getMilliseconds();

    const formattedDate = `${dayOfWeek}-${day}-${month}-${year} at ${hour}h ${minute}m ${second}s ${millisecond}ms`;

    return formattedDate;
  };

  generateAndSaveExcelFile() {
    // Generates and saves an Excel file (CSV format)
    const headerRow = Object.keys(this.head).map(key => this.formatHeader(key));
    // Formats the table header keys using formatHeader() function
    const rows = this.body.map(item => Object.keys(this.head).map(key => item[key]));
    // Maps the table body data to an array of arrays, where each inner array contains the values of each row

    const csvContent = [
      headerRow.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    // Combines the header row and the row data into a single CSV string

    const fileName = `${this.name.toLowerCase()}s_list (${this.getDateTimeStamp().toLowerCase()}).csv`;
    // Generates a unique filename using the current date and time

    const blob = new Blob([csvContent], { type: 'text/csv' });
    // Creates a Blob object from the CSV content

    const url = window.URL.createObjectURL(blob);
    // Creates a URL for the Blob object

    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = fileName;
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    // Creates a hidden anchor element, sets its URL and download attributes, triggers a click event to download the file,
    // and cleans up the URL object afterwards
  }
}
