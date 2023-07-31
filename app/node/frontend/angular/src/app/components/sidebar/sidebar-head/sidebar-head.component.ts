import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Component({
  selector: 'component-sidebar-head',
  templateUrl: './sidebar-head.component.html',
  styleUrls: ['./sidebar-head.component.scss']
})
export class SidebarHeadComponent {
  userName: string = '';
  userRole: string = '';

  constructor(private authService: AuthenticationService) {
    // this.authService.getUserInfoByAuthToken()
    //   .then(userInfo => {
    //     // Assign the user info to a component property or use it as needed
    //     console.log('User info:', userInfo);
    //     this.userName = userInfo.name;
    //     this.userRole = userInfo.role ? userInfo.role.name : '';
    //   })
    //   .catch(error => {
    //     console.error('Error:', error);
    //   });
    let userInfo = authService.userInfo;
    this.userName = userInfo.name;
    this.userRole = userInfo.role ? userInfo.role.name : '';
  }

}
