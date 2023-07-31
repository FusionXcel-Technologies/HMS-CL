import { Component, Input, OnInit } from '@angular/core';
import { ModulesService } from 'src/app/modules.service';

interface TableHead {
  name: string;
  key: string;
  width: number;
  type?: string;
  data_type: string[];
}

interface TableRow {
  [key: string]: any;
}

interface Table {
  data: TableRow[];
  name: string;
  head: { [key: string]: TableHead };
}

@Component({
  selector: 'app-body-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  @Input() url: string = '';
  table: Table = {
    data: [],
    name: '',
    head: {}
  };

  constructor(private modulesService: ModulesService) { }

  ngOnInit(): void {
    this.getTable();
  }

  getTable(): void {
    this.modulesService.sendRequestToServer<any>(`/${this.url}/list`, 'get').subscribe(
      (response: any) => {
        this.table.data = response;
        this.table.name = this.url.split('/').pop()?.toUpperCase() || '';
        this.generateTableHead();
        console.log(this.table);
      },
      (error: any) => {
        console.error(error);
        // Handle error properly and provide feedback to the user
      }
    );
  }

  private generateTableHead(): void {
    for (const rowData of this.table.data) {
      for (const key of Object.keys(rowData)) {
        const cellValue = rowData[key];

        if (!this.table.head[key]) {
          this.table.head[key] = {
            name: this.formatHeader(key),
            key,
            width: this.formatCellWidth(key.length),
            data_type: []
          };
        }

        rowData[key] = rowData[key] || '';
        this.table.head[key].data_type.push(this.getValueType(cellValue));

        this.table.head[key].type = this.findMostFrequentValue(this.table.head[key].data_type);

        this.table.head[key].width = Math.min(
          Math.max(
            this.formatCellWidth(cellValue?.length || 0),
            this.formatCellWidth(this.table.head[key].width || 0),
            this.formatCellWidth(this.table.head[key].name.length)
          ),
          50
        );
      }
    }
  }

  private formatHeader(header: string): string {
    return header.replace(/_/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase());
  }

  private findMostFrequentValue(strings: string[]): string | undefined {
    const countMap: { [key: string]: number } = {};

    strings.forEach((str) => {
      countMap[str] = (countMap[str] || 0) + 1;
    });

    let mostFrequentValue: string | undefined;
    let maxCount = 0;

    for (const str in countMap) {
      if (countMap.hasOwnProperty(str)) {
        if (countMap[str] > maxCount) {
          maxCount = countMap[str];
          mostFrequentValue = str;
        }
      }
    }

    return mostFrequentValue;
  }

  private formatCellWidth(width: any): number {
    width = parseInt(width);
    width = width > 18 ? 18 : width;
    width = width < 3 ? 3 : width;
    return width;
  }

  private getValueType(val: any): string {
    const mobileNumberPattern = /^[+]?\d{1,3}[-.\s]?\d{1,14}$/;
    const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    const dateRegex = /^([A-Za-z]+)-(\d+)-([A-Za-z]+)-(\d+)\sat\s(\d+):(\d+):(\d+):(\d+)$/;
    const linkPattern = /^(https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(\/.*)*$/;

    if (typeof val === 'string') {
      if (mobileNumberPattern.test(val)) {
        return 'mobile_number';
      } else if (dateRegex.test(val)) {
        return 'date';
      } else if (emailPattern.test(val)) {
        return 'email';
      } else if (linkPattern.test(val)) {
        return 'link';
      }
    }

    return typeof val;
  }
}
