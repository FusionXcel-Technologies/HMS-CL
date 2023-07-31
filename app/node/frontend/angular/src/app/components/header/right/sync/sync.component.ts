import { Component } from '@angular/core';

@Component({
  selector: 'component-header-right-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss']
})
export class SyncComponent {
  notificationText: string = '';
  statusClass: string = 'success';
}
