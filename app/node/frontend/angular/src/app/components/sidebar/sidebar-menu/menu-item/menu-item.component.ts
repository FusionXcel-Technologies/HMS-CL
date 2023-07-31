import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'component-sidebar-menu-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {
  @Input() name: string = '';
  @Input() link: string = '';
  @Input() itemClass: string = '';
  @Input() childs: any = [];

  constructor(private router: Router, private location: Location) {
  };

  goToLink() {
    if (this.link) {
      if (this.link.includes('http:') || this.link.includes('https:') || this.link.includes('www.')) {
        window.location.href = this.link;
        // this.router.navigate([this.link])
      } else {
        //   console.log([this.link]);

        this.router.navigate([this.link]);
      }
    }
  }

  openChilds() {
    this.itemClass = this.itemClass == 'open-childs' ? '' : 'open-childs';
  }

  ngOnInit(): void {
    if (this.childs?.length > 0) {
      this.itemClass = (this.location.path().split('/').includes(this.link.split('/')[1])) ? 'open-childs' : '';

    } else {
      this.itemClass = (this.location.path() == this.link) ? 'active' : '';
    }
  }
}
