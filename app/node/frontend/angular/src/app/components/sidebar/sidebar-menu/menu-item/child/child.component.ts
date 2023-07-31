import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'component-sidebar-menu-menu-item-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss']
})
export class ChildComponent {
  @Input() name: string = '';
  @Input() itemClass: string = '';
  @Input() link: string = '';

  constructor(private location: Location, private router: Router) { };

  goToLink() {
    if (this.link) {
      if (this.link.includes('http:') || this.link.includes('https:') || this.link.includes('www.')) {
        window.location.href = this.link;
      } else {
        this.router.navigateByUrl(this.link);
      }
    }
  };

  ngOnInit(): void {
    this.itemClass = (this.location.path() == this.link) ? 'active' : '';
  }
}
