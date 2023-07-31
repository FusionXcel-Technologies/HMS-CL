import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { ModulesService } from 'src/app/modules.service';

@Component({
  selector: 'component-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {
  menu: any;

  constructor(private router: Router, private authService: AuthenticationService) {

    this.authService.getSidebar().then(
      (sidebar: any) => {
        this.menu = sidebar;

      },
      (error: any) => {
        console.error(error);
        // Handle the error here
      }
    );
  }


  ngOnInit() {

  }


}
