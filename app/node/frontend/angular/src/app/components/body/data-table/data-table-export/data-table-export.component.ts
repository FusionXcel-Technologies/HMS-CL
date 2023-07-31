import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-data-table-export',
  templateUrl: './data-table-export.component.html',
  styleUrls: ['./data-table-export.component.scss']
})
export class DataTableExportComponent {

  @Input() table: any;

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

  generateAndSaveExcelFile(table: any) {
    // Generates and saves an Excel file (CSV format)
    const headerRow = Object.keys(table.head).map(key => table.head[key].name);


    // Formats the table header keys using formatHeader() function
    const rows = table.data.map((item: any) => Object.keys(table.head).map(key => item[key]));
    // Maps the table body data to an array of arrays, where each inner array contains the values of each row

    const csvContent = [
      headerRow.join(','),
      ...rows.map((row: any) => row.join(','))
    ].join('\n');
    // Combines the header row and the row data into a single CSV string

    const fileName = `${table.name.toLowerCase()}s_list (${this.getDateTimeStamp().toLowerCase()}).csv`;
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
